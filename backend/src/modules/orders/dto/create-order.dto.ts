import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({
    example: 'uuid-product-id',
    description: 'Product UUID',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product',
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'List of order items',
  })
  @ArrayNotEmpty()
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
