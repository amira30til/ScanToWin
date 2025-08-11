import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { AdminsModule } from './modules/admins/admins.module';
import { SubscriptionPermissionModule } from './modules/subscription-permission/subscription-permission.module';
import { PermissionModule } from './modules/permission/permission.module';
import { GameModule } from './modules/game/game.module';
import { UserGameModule } from './modules/user-game/user-game.module';
import { UsersModule } from './modules/users/users.module';
import { ShopsModule } from './modules/shops/shops.module';
import { ActiveGameAssignmentModule } from './modules/active-game-assignment/active-game-assignment.module';
import { RewardModule } from './modules/reward/reward.module';
import { RewardCategoryModule } from './modules/reward-category/reward-category.module';
import { MulterModule } from '@nestjs/platform-express';
import { ActionsModule } from './modules/actions/actions.module';
import { ChosenActionModule } from './modules/chosen-action/chosen-action.module';
import { RewardRedemptionModule } from './modules/reward-redemption/reward-redemption.module';
import { ActionClickModule } from './modules/action-click/action-click.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { GamePlayTrackingModule } from './modules/game-play-tracking/game-play-tracking.module';
import { APP_GUARD } from '@nestjs/core';
import { SuperAdminSeed } from './seeds/super-admin.seed';
import {
  AppConfig,
  DatabaseConfig,
  JwtConfig,
  RefreshJwtConfig,
} from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DatabaseConfig, AppConfig, JwtConfig, RefreshJwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...(await configService.get('database')),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AdminsModule,
    PermissionModule,
    SubscriptionPermissionModule,
    ActiveGameAssignmentModule,
    GameModule,
    UserGameModule,
    UsersModule,
    ShopsModule,
    RewardModule,
    RewardCategoryModule,
    ActionsModule,
    ChosenActionModule,
    MulterModule.register({}),
    RewardRedemptionModule,
    ActionClickModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    GamePlayTrackingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SuperAdminSeed,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
