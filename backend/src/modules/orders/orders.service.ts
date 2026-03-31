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
import { UsersService } from '@modules/users/users.service';
import { SubscribedService } from '@modules/users/enums/user.enums';
import { CreateMessageDto } from '@modules/notifications/dto/create.message';
import { QueryOrderDto } from './dto/query-order.dto';
import { OrderStatus } from './enums/order.enum';

@Injectable()
export class OrderService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // create order with items, calculate total, and trigger notifications
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

      const {
        recipientName,
        recipientPhone,
        recipientAddressLine1,
        recipientAddressLine2,
        city,
        postalCode,
        country,
      } = dto;

      const order = manager.create(Order, {
        idempotencyKey,
        items: [],
        recipientName,
        recipientPhone,
        recipientAddressLine1,
        recipientAddressLine2,
        city,
        postalCode,
        country,
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
      try {
        const orderResult = await manager.save(order);
        /*
        Trigger the notification to single device
          const userToken =   'dHGx70nG2I46VhfiCeCOQB:APA91bEAfYMUw6DrgcGTXpDGP4KXUKnE3TFEcvsZwQIza6BMONgL93DFc9CPC_6p_rHl6XWzInUbUFEBemhyKaBf61g_9YirHI0krnuq0T2XXO8_NaXfmlk';
          await this.notificationsService.sendPush(
            userToken,
            'Order Confirmed',
            `Your order #${order.id} is being processed.`,
          );
        */

        // send notifications to admins
        // Get admin users subscribed to order notifications
        const adminUsers = await this.usersService.getAdminUsers([
          SubscribedService.ORDER_NOTIFICATIONS,
        ]);

        // extract tokens
        const adminFcmTokens = adminUsers
          .flatMap((u) => u.fcmTokens || [])
          .filter((t) => !!t);
        // create message
        const message: CreateMessageDto = {
          notification: {
            title: 'New Order Received',
            body: `A new order for Rs. ${order.totalAmount} has been placed by ${recipientName}.`,
          },
          tokens: adminFcmTokens, // array of saved tokens
        };

        await this.notificationsService.sendPushToMany(message);

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

  async findAll(query: QueryOrderDto) {
    const { page = 1, limit = 10, status = OrderStatus.PLACED } = query;

    const [data, total] = await this.orderRepo.findAndCount({
      where: { status: status },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
