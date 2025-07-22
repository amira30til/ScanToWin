import { Injectable } from '@nestjs/common';
import { CreateRewardRedemptionDto } from './dto/create-reward-redemption.dto';
import { UpdateRewardRedemptionDto } from './dto/update-reward-redemption.dto';
import { RewardRedemption } from './entities/reward-redemption.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RewardRedemptionService {
  constructor(
    @InjectRepository(RewardRedemption)
    private rewardRedemption: Repository<RewardRedemption>,
  ) {}
  create(createRewardRedemptionDto: CreateRewardRedemptionDto) {
    return 'This action adds a new rewardRedemption';
  }

  findAll() {
    return `This action returns all rewardRedemption`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rewardRedemption`;
  }

  update(id: number, updateRewardRedemptionDto: UpdateRewardRedemptionDto) {
    return `This action updates a #${id} rewardRedemption`;
  }

  remove(id: number) {
    return `This action removes a #${id} rewardRedemption`;
  }
}
