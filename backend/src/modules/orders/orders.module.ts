import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderController } from './orders.controller';
import { OrderService } from './orders.service';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '@modules/products/entities/product.entity';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    NotificationsModule,
    UsersModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {}
