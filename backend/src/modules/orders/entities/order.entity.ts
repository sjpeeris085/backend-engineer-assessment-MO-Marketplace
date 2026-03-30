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

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Prevent duplicate orders (idempotency key)
  @Column({ unique: true })
  @Index()
  idempotencyKey: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
  })
  items: OrderItem[];
}
