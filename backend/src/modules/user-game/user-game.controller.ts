import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserGameService } from './user-game.service';
import { CreateUserGameDto } from './dto/create-user-game.dto';
import { UpdateUserGameDto } from './dto/update-user-game.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
}
