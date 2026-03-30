import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('Orders') // group in Swagger UI
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  // @ApiHeader({
  //   name: 'Idempotency-Key',
  //   description: 'Unique key to prevent duplicate orders',
  //   required: true,
  //   example: 'order-12345',
  // })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request (e.g., invalid product)',
  })
  @ApiResponse({
    status: 409,
    description: 'Duplicate order (idempotency conflict)',
  })
  create(
    @Body() dto: CreateOrderDto,
    @Headers('Idempotency-key') idempotencyKey: string,
  ) {
    return this.orderService.create(dto, idempotencyKey);
  }
}
