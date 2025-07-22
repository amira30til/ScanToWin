import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RewardRedemptionService } from './reward-redemption.service';
import { CreateRewardRedemptionDto } from './dto/create-reward-redemption.dto';
import { UpdateRewardRedemptionDto } from './dto/update-reward-redemption.dto';

@Controller('reward-redemption')
export class RewardRedemptionController {
  constructor(private readonly rewardRedemptionService: RewardRedemptionService) {}

  @Post()
  create(@Body() createRewardRedemptionDto: CreateRewardRedemptionDto) {
    return this.rewardRedemptionService.create(createRewardRedemptionDto);
  }

  @Get()
  findAll() {
    return this.rewardRedemptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rewardRedemptionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRewardRedemptionDto: UpdateRewardRedemptionDto) {
    return this.rewardRedemptionService.update(+id, updateRewardRedemptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rewardRedemptionService.remove(+id);
  }
}
