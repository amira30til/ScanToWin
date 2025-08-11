import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { RefreshJwtStrategy } from './strategies/refresh-strategy';
import { Admin } from '../admins/entities/admin.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConfig, RefreshJwtConfig } from '../../config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        ...(await configService.get('jwt')),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forFeature(JwtConfig),
    ConfigModule.forFeature(RefreshJwtConfig),
    PassportModule,
    TypeOrmModule.forFeature([Admin]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, RefreshJwtStrategy, MailService],
})
export class AuthModule {}
