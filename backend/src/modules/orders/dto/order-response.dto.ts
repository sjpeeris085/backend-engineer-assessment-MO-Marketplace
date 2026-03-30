import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  subTotal: number;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  idempotencyKey: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty()
  createdAt: Date;
}
