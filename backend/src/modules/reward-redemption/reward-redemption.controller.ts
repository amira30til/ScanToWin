import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RewardRedemptionService } from './reward-redemption.service';
import { CreateRewardRedemptionDto } from './dto/create-reward-redemption.dto';
import { UpdateRewardRedemptionDto } from './dto/update-reward-redemption.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { RewardRedemption } from './entities/reward-redemption.entity';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { AdminGuard } from '../auth/guards/admins.guard';
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('reward-redemption')
export class RewardRedemptionController {
  constructor(
    private readonly rewardRedemptionService: RewardRedemptionService,
  ) {}

  @Get('shop/:shopId')
  @ApiOperation({ summary: 'Get all reward redemptions by shop ID' })
  @ApiParam({ name: 'shopId', type: 'string', description: 'UUID of the shop' })
  @ApiResponse({
    status: 200,
    description: 'List of reward redemptions for the specified shop',
    type: [RewardRedemption],
  })
  findAllByShopId(
    @Param('shopId') shopId: string,
  ): Promise<
    ApiResponseInterface<RewardRedemption[]> | ErrorResponseInterface
  > {
    return this.rewardRedemptionService.findAllByShopId(shopId);
  }

  @Get('chosen-action/:chosenActionId')
  @ApiOperation({ summary: 'Get all reward redemptions by chosen action ID' })
  @ApiParam({
    name: 'chosenActionId',
    type: 'string',
    description: 'UUID of the chosen action',
  })
  @ApiResponse({
    status: 200,
    description: 'List of reward redemptions for the specified chosen action',
    type: [RewardRedemption],
  })
  findAllByChosenActionId(
    @Param('chosenActionId') chosenActionId: string,
  ): Promise<
    ApiResponseInterface<RewardRedemption[]> | ErrorResponseInterface
  > {
    return this.rewardRedemptionService.findAllByChosenActionId(chosenActionId);
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
  update(
    @Param('id') id: string,
    @Body() updateRewardRedemptionDto: UpdateRewardRedemptionDto,
  ) {
    return this.rewardRedemptionService.update(+id, updateRewardRedemptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rewardRedemptionService.remove(+id);
  }
}
