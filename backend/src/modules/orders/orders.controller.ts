import { Controller, Post, Body, Headers, Query, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { OrderStatus } from './enums/order.enum';

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

  @Get()
  @ApiOperation({ summary: 'Get paginated order list' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', required: false, example: OrderStatus.PLACED })
  @ApiResponse({ status: 200, description: 'Order list fetched' })
  findAll(@Query() query: QueryOrderDto) {
    return this.orderService.findAll(query);
  }
}
