import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Scan To Win API')
    .setDescription(
      `Scan to Win API
An interactive gamified marketing platform allowing clients to scan QR codes, play games, and leave reviews in exchange for rewards. Admins manage campaigns, QR codes, gifts, and customer interactions, while Super Admins oversee the entire ecosystem across multiple shops and admins.`,
    )
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  app.useGlobalFilters(new GlobalExceptionFilter());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(3000);
}

bootstrap();
