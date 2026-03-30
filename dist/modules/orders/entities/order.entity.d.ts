import { OrderItem } from './order-item.entity';
export declare class Order {
    id: string;
    idempotencyKey: string;
    totalAmount: number;
    createdAt: Date;
    items: OrderItem[];
}
