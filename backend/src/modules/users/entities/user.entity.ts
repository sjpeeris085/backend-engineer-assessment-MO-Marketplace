import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { UserRole, SubscribedService } from '../enums/user.enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  // Store enum array as JSON
  @Column({ type: 'json', nullable: true })
  subscribed_services: SubscribedService[];

  // Store multiple device tokens
  @Column({ type: 'json', nullable: true })
  fcmTokens: string[];

  @CreateDateColumn()
  createdAt: Date;
}
