import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
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
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { Reward } from './entities/reward.entity';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post()
  @ApiOperation({
    summary: 'Create a new reward',
    description:
      'Creates a new reward for a shop. Each reward can be associated with a category.',
  })
  @ApiBody({
    type: CreateRewardDto,
    description: 'Reward creation data',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Reward created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        data: {
          type: 'object',
          properties: {
            reward: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'uuid-string' },
                name: { type: 'string', example: 'iPhone 15 Pro' },
                icon: {
                  type: 'string',
                  example: 'https://example.com/icons/iphone.png',
                },
                winnerCount: { type: 'number', example: 5 },
                isUnlimited: { type: 'boolean', example: false },
                isActive: { type: 'boolean', example: true },
                categoryId: { type: 'string', example: 'category-uuid' },
                shopId: { type: 'string', example: 'shop-uuid' },
                createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
                updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
              },
            },
            message: { type: 'string', example: 'Reward created successfully' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Reward with this name already exists for this shop',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop or category not found',
  })
  async create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardService.create(createRewardDto);
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

  @UseGuards(AdminGuard)
  @Get('by-shop/:shopId')
  @ApiBearerAuth()
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
    console.log('shopp', shopId);
    console.log('ids', id);

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
  @Post('shops/:shopId/simulate-rewards')
  @ApiOperation({ summary: 'Select a random reward for a shop' })
  @ApiParam({ name: 'shopId', description: 'Shop ID' })
  @ApiQuery({
    name: 'totalPlayers',
    required: false,
    description: 'Total number of players (default: 1000)',
  })
  async simulateRewards(
    @Param('shopId') shopId: string,
    @Query('totalPlayers') totalPlayers?: string,
  ) {
    const players = totalPlayers ? parseInt(totalPlayers) : 1000;

    try {
      const result = await this.rewardService.selectRandomReward(
        shopId,
        players,
      );

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
