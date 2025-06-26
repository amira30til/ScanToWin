import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { Reward } from './entities/reward.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardCategory } from '../reward-category/entities/reward-category.entity';
import { Shop } from '../shops/entities/shop.entity';
import { JwtService } from '@nestjs/jwt';
import { ActiveGameAssignment } from '../active-game-assignment/entities/active-game-assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reward,
      RewardCategory,
      Shop,
      ActiveGameAssignment,
    ]),
  ],
  controllers: [RewardController],
  providers: [RewardService, JwtService],
  exports: [RewardService],
})
export class RewardModule {}
