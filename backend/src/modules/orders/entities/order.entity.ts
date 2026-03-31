// order.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../enums/order.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Prevent duplicate orders (idempotency key)
  @Column({ unique: true })
  @Index()
  idempotencyKey: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PLACED,
  })
  status: OrderStatus;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column()
  recipientName: string;

  @Column()
  recipientPhone: string;

  @Column()
  recipientAddressLine1: string;

  @Column({ nullable: true })
  recipientAddressLine2?: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;

  @CreateDateColumn()
  createdAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
  })
  items: OrderItem[];
}
