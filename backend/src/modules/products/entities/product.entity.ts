import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('products')
@Unique(['name', 'model'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index() // for faster search/filter
  name: string;

  @Column({ default: 'unknown' })
  @Index()
  model: string;

  // Unique identification (URL)
  @Column({ unique: true })
  @Index()
  slug: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
