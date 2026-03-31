import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto';
import { SubscribedService } from './enums/user.enums';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ---------------------------
  // Register
  // ---------------------------
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: User,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
  })
  register(@Body() dto: CreateUserDto) {
    return this.usersService.register(dto);
  }

  // ---------------------------
  // Login
  // ---------------------------
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  login(@Body() dto: LoginDto) {
    return this.usersService.login(dto);
  }

  // ---------------------------
  // Get Admin Users by Services
  // ---------------------------
  @Get('admins')
  @ApiOperation({
    summary: 'Get admin users filtered by subscribed services',
  })
  @ApiQuery({
    name: 'services',
    required: false,
    description:
      'Comma-separated services (ORDER_NOTIFICATIONS, NEW_USER_REGISTRATIONS)',
    example: 'ORDER_NOTIFICATIONS,NEW_USER_REGISTRATIONS',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin users fetched successfully',
    type: [User],
  })
  getAdmins(@Query('services') services?: string) {
    const parsedServices: SubscribedService[] = services
      ? (services.split(',') as SubscribedService[])
      : [];

    return this.usersService.getAdminUsers(parsedServices);
  }

  // ---------------------------
  // Save FCM Token
  // ---------------------------
  @Post(':id/fcm-token')
  @ApiOperation({ summary: 'Save FCM token for a user' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 'uuid-user-id',
  })
  @ApiBody({ type: UpdateFcmTokenDto })
  @ApiResponse({
    status: 200,
    description: 'FCM token saved successfully',
  })
  saveFcmToken(@Param('id') userId: string, @Body() dto: UpdateFcmTokenDto) {
    return this.usersService.saveFcmToken(userId, dto.fcmToken);
  }
}
