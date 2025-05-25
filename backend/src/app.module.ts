import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres'>('database.type'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        synchronize: configService.get<boolean>('database.synchronize'),
        autoLoadEntities: configService.get<boolean>(
          'database.autoLoadEntities',
        ),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
