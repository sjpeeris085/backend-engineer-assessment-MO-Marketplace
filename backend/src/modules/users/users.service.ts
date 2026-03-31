import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { SubscribedService, UserRole } from './enums/user.enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // 1. Register
  async register(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = (await bcrypt.hash(dto.password, 10)) as string;

    const user = this.userRepo.create({
      ...dto,
      password: hashedPassword,
      subscribed_services: dto.subscribed_services || [],
      fcmTokens: [],
    });

    return this.userRepo.save(user);
  }

  // 2. Login
  async login(dto: LoginDto): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  // 3. Get Admin Users by subscribed services
  async getAdminUsers(services: SubscribedService[]): Promise<User[]> {
    const query = this.userRepo
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.ADMIN });

    if (services && services.length > 0) {
      query.andWhere(
        `
      EXISTS (
        SELECT 1
        FROM json_array_elements_text(user.subscribed_services) AS service
        WHERE service IN (:...services)
      )
      `,
        { services },
      );
    }

    return query.getMany();
  }

  // 4. Save FCM Token
  async saveFcmToken(userId: string, token: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return;

    const tokens = user.fcmTokens || [];

    if (!tokens.includes(token)) {
      tokens.push(token);
    }

    user.fcmTokens = tokens;

    await this.userRepo.save(user);
  }
}
