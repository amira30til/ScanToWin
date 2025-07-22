import { Module } from '@nestjs/common';
import { RewardRedemptionService } from './reward-redemption.service';
import { RewardRedemptionController } from './reward-redemption.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardRedemption } from './entities/reward-redemption.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RewardRedemption])],
  controllers: [RewardRedemptionController],
  providers: [RewardRedemptionService],
  exports: [RewardRedemptionService],
})
export class RewardRedemptionModule {}
