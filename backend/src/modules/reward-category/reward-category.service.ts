import { Injectable } from '@nestjs/common';
import { CreateRewardCategoryDto } from './dto/create-reward-category.dto';
import { UpdateRewardCategoryDto } from './dto/update-reward-category.dto';

@Injectable()
export class RewardCategoryService {
  create(createRewardCategoryDto: CreateRewardCategoryDto) {
    return 'This action adds a new rewardCategory';
  }

  findAll() {
    return `This action returns all rewardCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rewardCategory`;
  }

  update(id: number, updateRewardCategoryDto: UpdateRewardCategoryDto) {
    return `This action updates a #${id} rewardCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} rewardCategory`;
  }
}
