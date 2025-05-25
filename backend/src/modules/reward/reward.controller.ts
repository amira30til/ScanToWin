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
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admins.guard';

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
  async create(@Body() createRewardDto: CreateRewardDto, @Req() req: any) {
    const shopId = req.user.shopId;
    return this.rewardService.create(createRewardDto, shopId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all rewards',
    description:
      'Retrieves all rewards. If accessed by shop owner, returns only their rewards.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rewards retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            rewards: {
              type: 'array',
              items: {
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
                  category: { type: 'object' },
                  shop: { type: 'object' },
                },
              },
            },
            count: { type: 'number', example: 10 },
            message: {
              type: 'string',
              example: 'Rewards retrieved successfully',
            },
          },
        },
      },
    },
  })
  async findAll(@Req() req: any) {
    const shopId = req.user.role === 'SHOP_OWNER' ? req.user.shopId : undefined;
    return this.rewardService.findAll(shopId);
  }

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
  async findOne(@Param('id') id: string, @Req() req: any) {
    const shopId = req.user.role === 'SHOP_OWNER' ? req.user.shopId : undefined;
    return this.rewardService.findOne(id, shopId);
  }

  @Patch(':id')
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
    @Body() updateRewardDto: UpdateRewardDto,
    @Req() req: any,
  ) {
    const shopId = req.user.shopId;
    return this.rewardService.update(id, updateRewardDto, shopId);
  }

  @Delete(':id')
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reward deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reward not found',
  })
  async remove(@Param('id') id: string, @Req() req: any) {
    const shopId = req.user.shopId;
    return this.rewardService.remove(id, shopId);
  }
}
