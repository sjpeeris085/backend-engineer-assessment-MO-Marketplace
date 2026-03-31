import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ArrayUnique,
} from 'class-validator';
import { UserRole, SubscribedService } from '../enums/user.enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Sanjaya' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'sjpeeris.sl@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'ADMIN' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ example: ['ORDER_NOTIFICATIONS'] })
  @IsOptional()
  @ArrayUnique()
  @IsEnum(SubscribedService, { each: true })
  subscribed_services?: SubscribedService[];
}
