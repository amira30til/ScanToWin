import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import * as cookieParser from 'cookie-parser';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from './modules/admins/entities/admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const adminRepo = app.get<Repository<Admin>>(getRepositoryToken(Admin));
  const superAdmin = await adminRepo.findOne({
    where: { role: 'SUPER_ADMIN' },
  });

  if (!superAdmin) {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('Missing SUPER_ADMIN_EMAIL env variable');
    }
    const salt = await bcrypt.genSalt();
    const cryptedPassword = await bcrypt.hash(password, salt);

    const newAdmin = adminRepo.create({
      email,
      password: cryptedPassword,
      role: 'SUPER_ADMIN',
    });
    await adminRepo.save(newAdmin);
  }

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow: boolean) => void,
    ) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:4173',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Scan To Win API')
    .setDescription(
      `Scan to Win API
      An interactive gamified marketing platform allowing clients to scan QR codes, play games, and leave reviews in exchange for rewards. Admins manage campaigns, QR codes, gifts, and customer interactions, while Super Admins oversee the entire ecosystem across multiple shops and admins.`,
    )
    .setVersion('0.0.1')
    .addCookieAuth('refresh_token')
    .addBearerAuth()
    .build();

  app.useGlobalFilters(new GlobalExceptionFilter());
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      //operationsSorter: 'alpha',
    },
  });

  await app.listen(3000);
}

void bootstrap();
