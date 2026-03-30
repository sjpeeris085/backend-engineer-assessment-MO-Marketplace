export declare class OrderItemResponseDto {
    productId: string;
    quantity: number;
    price: number;
    subTotal: number;
}
export declare class OrderResponseDto {
    id: string;
    idempotencyKey: string;
    totalAmount: number;
    items: OrderItemResponseDto[];
    createdAt: Date;
}
