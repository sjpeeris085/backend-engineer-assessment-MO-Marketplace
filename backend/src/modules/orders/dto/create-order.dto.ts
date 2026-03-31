import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsInt,
  Min,
  ArrayNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
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

  // Billing Details.................

  @ApiProperty({
    example: 'Sanjaya Peiris',
    description: 'Recipient full name',
  })
  @IsString()
  recipientName: string;

  @ApiProperty({
    example: '+94761631054',
    description: 'Recipient phone number',
  })
  @IsString()
  recipientPhone: string;

  @ApiProperty({
    example: 'No 123, Galle Road',
    description: 'Primary address line',
  })
  @IsString()
  recipientAddressLine1: string;

  @ApiPropertyOptional({
    example: 'Apartment 4B',
    description: 'Secondary address line (optional)',
  })
  @IsOptional()
  @IsString()
  recipientAddressLine2?: string;

  @ApiProperty({
    example: 'Galle',
    description: 'City',
  })
  @IsString()
  city: string;

  @ApiProperty({
    example: '00300',
    description: 'Postal code',
  })
  @IsString()
  postalCode: string;

  @ApiProperty({
    example: 'Sri Lanka',
    description: 'Country',
  })
  @IsString()
  country: string;
}
