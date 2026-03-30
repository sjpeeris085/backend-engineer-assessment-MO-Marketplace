import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(dto: CreateOrderDto, idempotencyKey: string): Promise<import("./entities/order.entity").Order>;
}
