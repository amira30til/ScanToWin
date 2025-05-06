import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RewardCategoryService } from './reward-category.service';
import { CreateRewardCategoryDto } from './dto/create-reward-category.dto';
import { UpdateRewardCategoryDto } from './dto/update-reward-category.dto';

@Controller('reward-category')
export class RewardCategoryController {
  constructor(private readonly rewardCategoryService: RewardCategoryService) {}

  @Post()
  create(@Body() createRewardCategoryDto: CreateRewardCategoryDto) {
    return this.rewardCategoryService.create(createRewardCategoryDto);
  }

  @Get()
  findAll() {
    return this.rewardCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rewardCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRewardCategoryDto: UpdateRewardCategoryDto) {
    return this.rewardCategoryService.update(+id, updateRewardCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rewardCategoryService.remove(+id);
  }
}
