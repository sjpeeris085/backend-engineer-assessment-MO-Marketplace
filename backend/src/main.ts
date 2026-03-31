import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { winstonLogger } from './common/logger/winston.logger';
import { initializeFirebase } from '@config/firebase.config';

async function bootstrap() {
  initializeFirebase();

  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  // register swagger
  const config = new DocumentBuilder()
    .setTitle('Backend Assessment API')
    .setDescription('Product, Order, Notification APIs')
    .setVersion('1.0')
    .addTag('products')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes extra fields
      forbidNonWhitelisted: true, // throws error for unknown fields
      transform: true, // converts types (string → number)
    }),
  );

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document); // http://localhost:3000/api

  app.enableCors({
    origin: '*',
  });

  const PORT = Number(process.env.PORT) || 8080;
  // await app.listen(PORT, '0.0.0.0');

  await app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `:::::::::::::::::: API STARTED SERVING ON PORT ${PORT} ::::::::::::::::::`,
    );
  });
}
bootstrap();
