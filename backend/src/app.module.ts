import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as dotenv from 'dotenv';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductsModule } from '@modules/products/products.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { UsersModule } from '@modules/users/users.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      port:
        process.env.NODE_ENV === 'production'
          ? undefined // socket connection ignores port
          : parseInt(process.env.DB_PORT ?? '5432', 10),
      host:
        process.env.NODE_ENV === 'production'
          ? `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
          : process.env.DB_HOST,
      username: process.env.DB_USERNAME, // 'postgres',
      password: process.env.DB_PASSWORD, // 'root'
      database: process.env.DB_NAME, // 'backend_assessment'
      // entities: [Product],
      autoLoadEntities: true,
      synchronize: true, // dev only
    }),
    ProductsModule,
    OrdersModule,
    NotificationsModule,
    UsersModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format:
            process.env.NODE_ENV === 'production'
              ? winston.format.combine(
                  winston.format.timestamp(),
                  winston.format.errors({ stack: true }),
                  winston.format.json(),
                )
              : winston.format.combine(
                  winston.format.timestamp(),
                  winston.format.colorize(),
                  winston.format.printf(
                    ({ level, message, timestamp, url, method, ...meta }) => {
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      return `${timestamp} [${level}] [${method}] ${message} ${url} ${JSON.stringify(meta)}`;
                    },
                  ),
                ),
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
