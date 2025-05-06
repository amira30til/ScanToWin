import { Module } from '@nestjs/common';
import { SubscriptionPermissionService } from './subscription-permission.service';
import { SubscriptionPermissionController } from './subscription-permission.controller';

@Module({
  controllers: [SubscriptionPermissionController],
  providers: [SubscriptionPermissionService],
})
export class SubscriptionPermissionModule {}
