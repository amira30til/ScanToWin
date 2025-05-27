import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { RewardCategoryService } from './reward-category.service';
import { CreateRewardCategoryDto } from './dto/create-reward-category.dto';
import { UpdateRewardCategoryDto } from './dto/update-reward-category.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('reward-category')
export class RewardCategoryController {
  constructor(private readonly rewardCategoryService: RewardCategoryService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new reward category',
    description:
      'Creates a new reward category. Only super admins can create categories.',
  })
  @ApiBody({
    type: CreateRewardCategoryDto,
    description: 'Reward category creation data',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Reward category created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        data: {
          type: 'object',
          properties: {
            category: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'uuid-string' },
                name: { type: 'string', example: 'Electronics' },
                createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
                updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
              },
            },
            message: {
              type: 'string',
              example: 'Reward category created successfully',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Reward category with this name already exists',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 409 },
        message: {
          type: 'string',
          example: "Reward category with name 'Electronics' already exists",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  async create(@Body() createRewardCategoryDto: CreateRewardCategoryDto) {
    return this.rewardCategoryService.create(createRewardCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all reward categories',
    description:
      'Retrieves all reward categories with their associated rewards.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reward categories retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            categories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'uuid-string' },
                  name: { type: 'string', example: 'Electronics' },
                  createdAt: {
                    type: 'string',
                    example: '2024-01-15T10:30:00Z',
                  },
                  updatedAt: {
                    type: 'string',
                    example: '2024-01-15T10:30:00Z',
                  },
                  rewards: { type: 'array', items: { type: 'object' } },
                },
              },
            },
            count: { type: 'number', example: 5 },
            message: {
              type: 'string',
              example: 'Reward categories retrieved successfully',
            },
          },
        },
      },
    },
  })
  async findAll() {
    return this.rewardCategoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a reward category by ID',
    description:
      'Retrieves a specific reward category with its associated rewards.',
  })
  @ApiParam({
    name: 'id',
    description: 'Reward category ID',
    type: 'string',
    example: 'uuid-string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reward category retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reward category not found',
  })
  async findOne(@Param('id') id: string) {
    return this.rewardCategoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a reward category',
    description:
      'Updates a specific reward category. Only super admins can update categories.',
  })
  @ApiParam({
    name: 'id',
    description: 'Reward category ID',
    type: 'string',
    example: 'uuid-string',
  })
  @ApiBody({
    type: UpdateRewardCategoryDto,
    description: 'Reward category update data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reward category updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reward category not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Reward category with this name already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updateRewardCategoryDto: UpdateRewardCategoryDto,
  ) {
    return this.rewardCategoryService.update(id, updateRewardCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a reward category',
    description:
      'Deletes a specific reward category. Cannot delete if it has associated rewards.',
  })
  @ApiParam({
    name: 'id',
    description: 'Reward category ID',
    type: 'string',
    example: 'uuid-string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reward category deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reward category not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Cannot delete category with associated rewards',
  })
  async remove(@Param('id') id: string) {
    return this.rewardCategoryService.remove(id);
  }
}
