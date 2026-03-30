import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { Product } from '@modules/products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { NotificationsService } from '@modules/notifications/notifications.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateOrderDto, idempotencyKey: string) {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }

    // Check duplicate (idempotency)
    const existing = await this.orderRepo.findOne({
      where: { idempotencyKey },
      relations: ['items'],
    });

    if (existing) {
      return existing; // return same response (idempotent)
    }

    return this.dataSource.transaction(async (manager) => {
      const productIds = dto.items.map((i) => i.productId);

      const products: Product[] = await manager.findBy(Product, {
        id: In(productIds),
        isActive: true,
      });

      if (products.length !== productIds.length) {
        throw new BadRequestException('Some products are invalid');
      }

      const productMap: Map<string, Product> = new Map(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        products.map((p): [string, Product] => [p.id, p]),
      );

      let totalAmount = 0;

      const order = manager.create(Order, {
        idempotencyKey,
        items: [],
      });

      for (const item of dto.items) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const product = productMap.get(item.productId);

        if (!product) {
          throw new BadRequestException(`Product not found: ${item.productId}`);
        }

        const subTotal = Number(product.price) * item.quantity;

        const orderItem = manager.create(OrderItem, {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          productId: product.id,
          quantity: item.quantity,
          price: Number(product.price),
          subTotal,
        });

        totalAmount += subTotal;
        order.items.push(orderItem);
      }

      order.totalAmount = totalAmount;
      const userToken = 'test-token-12345';
      try {
        const orderResult = await manager.save(order);
        // Trigger the notification!
        await this.notificationsService.sendPush(
          userToken,
          'Order Confirmed',
          `Your HeladivaTech order #${order.id} is being processed.`,
        );

        return orderResult;
      } catch (err) {
        //  Handle race condition (duplicate key)
        if (err.code === '23505') {
          throw new ConflictException('Duplicate order (idempotency)');
        }
        throw err;
      }
    });
  }
}
