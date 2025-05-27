import { Module } from '@nestjs/common';
import { RewardCategoryService } from './reward-category.service';
import { RewardCategoryController } from './reward-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardCategory } from './entities/reward-category.entity';
import { Reward } from '../reward/entities/reward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RewardCategory, Reward])],
  controllers: [RewardCategoryController],
  providers: [RewardCategoryService],
  exports: [RewardCategoryService],
})
export class RewardCategoryModule {}
