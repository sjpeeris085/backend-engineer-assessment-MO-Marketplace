import { Order } from './order.entity';
import { Product } from '@modules/products/entities/product.entity';
export declare class OrderItem {
    id: string;
    orderId: string;
    productId: string;
    order: Order;
    product: Product;
    quantity: number;
    price: number;
    subTotal: number;
}
