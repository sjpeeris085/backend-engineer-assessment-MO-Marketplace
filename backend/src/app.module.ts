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
      // host: process.env.DB_HOST,
      // port: 5432,
      host: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
      username: process.env.DB_USERNAME, // 'postgres',
      password: process.env.DB_PASSWORD, // 'root'
      database: process.env.DB_NAME, // 'backend_assessment'
      // entities: [Product],
      autoLoadEntities: true,
      synchronize: true, // dev only
      // synchronize: process.env.NODE_ENV !== 'production',

      // Google Cloud Production
      // extra:
      //   process.env.NODE_ENV === 'production'
      //     ? {
      //         socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
      //       }
      //     : {},
    }),
    ProductsModule,
    OrdersModule,
    NotificationsModule,
    UsersModule,
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
