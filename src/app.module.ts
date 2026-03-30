import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductsModule } from '@modules/products/products.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: 'postgres', // process.env.DB_USERNAME,
      password: 'root', //process.env.DB_PASSWORD,
      database: 'backend_assessment', //process.env.DB_NAME,

      // entities: [Product],
      autoLoadEntities: true,
      synchronize: true, // dev only
    }),
    ProductsModule,
    OrdersModule,
    NotificationsModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              ({ level, message, timestamp, url, method }) =>
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `${timestamp} [${level}] [${method}] ${message} ${url}`,
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
