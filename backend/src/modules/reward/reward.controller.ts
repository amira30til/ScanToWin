import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { UpsertRewardsDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admins.guard';
import { RewardStatus } from './enums/reward-status.enums';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post()
  @ApiOperation({
    summary: 'Create / update / delete rewards in bulk',
    description:
      'Receives an array of rewards and performs upsert logic: create if no id, update if id exists, delete if disappeared.',
  })
  @ApiBody({ type: UpsertRewardsDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Rewards processed successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Duplicate reward name for this shop',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found',
  })
  async upsertRewards(@Body() dto: UpsertRewardsDto) {
    return this.rewardService.upsertMany(dto.shopId, dto.rewards);
  }
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: 'Get all rewards',
    description: 'Retrieves all rewards with optional pagination.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.rewardService.findAll(page, limit);
  }

  @Get('by-shop/:shopId')
  @ApiOperation({
    summary: 'Get rewards by shop',
    description:
      'Retrieves rewards for the authenticated shop with optional pagination.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAllByShop(
    @Param('shopId') shopId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.rewardService.findAllByShop(shopId, page, limit);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({
    summary: 'Get a reward by ID',
    description:
      'Retrieves a specific reward with its category and shop information.',
  })
  @ApiParam({
    name: 'id',
    description: 'Reward ID',
    type: 'string',
    example: 'uuid-string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reward retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reward not found',
  })
  async findOneById(@Param('id') id: string) {
    return this.rewardService.findOneById(id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get('by-shop/:id/shopId/:shopId')
  @ApiOperation({
    summary: 'Get a reward by ID and Shop ID',
    description: 'Retrieves a specific active reward belonging to a shop.',
  })
  @ApiParam({ name: 'id', required: true, description: 'Reward ID' })
  @ApiParam({ name: 'shopId', required: true, description: 'Shop ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reward retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reward not found',
  })
  async findOneByIdAndShop(
    @Param('id') id: string,
    @Param('shopId') shopId: string,
  ) {
    return this.rewardService.findOneByIdAndShop(id, shopId);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Patch(':id/shop/:shopId')
  @ApiOperation({
    summary: 'Update a reward',
    description:
      'Updates a specific reward. Shop owners can only update their own rewards.',
  })
  @ApiParam({
    name: 'id',
    description: 'Reward ID',
    type: 'string',
    example: 'uuid-string',
  })
  @ApiBody({
    type: UpdateRewardDto,
    description: 'Reward update data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reward updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reward not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Reward with this name already exists for this shop',
  })
  async update(
    @Param('id') id: string,
    @Param('shopId') shopId: string,
    @Body() updateRewardDto: UpdateRewardDto,
  ) {
    return this.rewardService.update(id, shopId, updateRewardDto);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Delete(':id/shopId')
  @ApiOperation({
    summary: 'Delete a reward',
    description:
      'Deletes a specific reward. Shop owners can only delete their own rewards.',
  })
  @ApiParam({
    name: 'id',
    description: 'Reward ID',
    type: 'string',
    example: 'uuid-string',
  })
  @ApiParam({
    name: 'shopId',
    description: 'Shop ID',
    type: 'string',
    example: 'uuid-string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reward deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reward not found',
  })
  async remove(@Param('id') id: string, @Param('shopId') shopId: string) {
    return this.rewardService.remove(id, shopId);
  }
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get('rewards/by-status')
  @ApiOperation({ summary: 'Get rewards by status' })
  @ApiQuery({ name: 'status', enum: RewardStatus, required: true })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getByStatus(
    @Query('status') status: RewardStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.rewardService.findByStatus(status, page, limit);
  }

  @Post('shops/:shopId/random-rewards')
  @ApiOperation({ summary: 'Select a random reward for a shop' })
  @ApiParam({ name: 'shopId', description: 'Shop ID' })
  async simulateRewards(@Param('shopId') shopId: string) {
    try {
      const result = await this.rewardService.selectRandomReward(shopId);
      return result;
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        data: {
          reward: null,
          message: error.message,
        },
      };
    }
  }
}
