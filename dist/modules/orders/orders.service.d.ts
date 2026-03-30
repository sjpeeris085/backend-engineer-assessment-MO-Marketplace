import { DataSource, Repository } from 'typeorm';
import { Product } from '@modules/products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { NotificationsService } from '@modules/notifications/notifications.service';
export declare class OrderService {
    private readonly dataSource;
    private readonly notificationsService;
    private readonly orderRepo;
    private readonly productRepo;
    constructor(dataSource: DataSource, notificationsService: NotificationsService, orderRepo: Repository<Order>, productRepo: Repository<Product>);
    create(dto: CreateOrderDto, idempotencyKey: string): Promise<Order>;
}
