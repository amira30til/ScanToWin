import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserGameService } from './user-game.service';
import {
  CreateUserGameDto,
  UserGameStatsDto,
} from './dto/create-user-game.dto';
import { UpdateUserGameDto } from './dto/update-user-game.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';

@Controller('user-game')
export class UserGameController {
  constructor(private readonly userGameService: UserGameService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user-game relationship' })
  @ApiResponse({ status: 201, description: 'User game created successfully' })
  async create(@Body() createDto: CreateUserGameDto) {
    return this.userGameService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user-game relationships' })
  @ApiResponse({ status: 200, description: 'User games fetched successfully' })
  async findAll() {
    return this.userGameService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user-game relationship by ID' })
  @ApiResponse({ status: 200, description: 'User game fetched successfully' })
  @ApiResponse({ status: 404, description: 'User game not found' })
  async findOne(@Param('id') id: string) {
    return this.userGameService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user-game relationship' })
  @ApiResponse({ status: 200, description: 'User game updated successfully' })
  @ApiResponse({ status: 404, description: 'User game not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateUserGameDto) {
    return this.userGameService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user-game relationship' })
  @ApiResponse({ status: 200, description: 'User game deleted successfully' })
  @ApiResponse({ status: 404, description: 'User game not found' })
  async remove(@Param('id') id: string) {
    return this.userGameService.remove(id);
  }

  @Post(':id/increment-play')
  @ApiOperation({ summary: 'Increment play count for a user-game' })
  @ApiResponse({
    status: 200,
    description: 'Play count incremented successfully',
  })
  @ApiResponse({ status: 404, description: 'User game not found' })
  async incrementPlayCount(@Param('id') id: string) {
    return this.userGameService.incrementPlayCount(id);
  }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Get user-games by user ID' })
  @ApiResponse({ status: 200, description: 'User games fetched successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUser(@Param('userId') userId: string) {
    return this.userGameService.findByUser(userId);
  }

  @Get('by-game/:gameId')
  @ApiOperation({ summary: 'Get user-games by chosen game ID' })
  @ApiResponse({ status: 200, description: 'User games fetched successfully' })
  @ApiResponse({ status: 404, description: 'Chosen game not found' })
  async findByChosenGame(@Param('gameId') gameId: string) {
    return this.userGameService.findByChosenGame(gameId);
  }

  ///////////////////////
  @Get('verify/:userId/:shopId')
  @ApiOperation({
    summary: 'Verify user cooldown status',
    description:
      'Check if a user can play again at a specific shop based on 24-hour cooldown period since last play',
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user to check',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ApiParam({
    name: 'shopId',
    description: 'The ID of the shop to check against',
    example: '987e6543-e21b-54d3-a789-426614175000',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User can play - no cooldown active',
    schema: {
      example: {
        userId: '123e4567-e89b-12d3-a456-426614174000',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User cannot play - cooldown active',
    schema: {
      example: {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        code: 'COOLDOWN',
        timestamp: 12345678,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameters provided',
  })
  async verifyUserCooldown(
    @Param('userId') userId: string,
    @Param('shopId') shopId: string,
  ): Promise<{ userId: string; code?: string; timestamp?: number }> {
    return await this.userGameService.verifyUserCooldown(userId, shopId);
  }
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: all)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Results per page (default: all)',
    type: Number,
  })
  @ApiOperation({ summary: 'Get users by shop with optional pagination and total count' })
  @Get('by-shop/:shopId')
  async getUsersByShopId(
    @Param('shopId') shopId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<
    ApiResponseInterface<{ users: UserGameStatsDto[] }> | ErrorResponseInterface
  > {
    return this.userGameService.getUsersByShopId(shopId, page, limit);
  }
}
