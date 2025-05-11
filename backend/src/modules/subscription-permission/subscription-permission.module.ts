import { Module } from '@nestjs/common';
import { SubscriptionPermissionService } from './subscription-permission.service';
import { SubscriptionPermissionController } from './subscription-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlanModule } from '../subscription-plan/subscription-plan.module';
import { SubscriptionPermission } from './entities/subscription-permission.entity';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionPermission]),
    PermissionModule,
    SubscriptionPlanModule,
  ],
  controllers: [SubscriptionPermissionController],
  providers: [SubscriptionPermissionService],
  exports: [SubscriptionPermissionService],
})
export class SubscriptionPermissionModule {}
