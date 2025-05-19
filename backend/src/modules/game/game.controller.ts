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
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuperAdminGuard } from '../auth/guards/admins.guard';

@ApiBearerAuth()
@UseGuards(SuperAdminGuard)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({ status: 201, description: 'Game created successfully' })
  async create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all games' })
  @ApiResponse({ status: 200, description: 'Games fetched successfully' })
  async findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a game by ID' })
  @ApiResponse({ status: 200, description: 'Game fetched successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async findOne(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a game' })
  @ApiResponse({ status: 200, description: 'Game updated successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(id, updateGameDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a game' })
  @ApiResponse({ status: 200, description: 'Game deleted successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async remove(@Param('id') id: string) {
    return this.gameService.remove(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a game' })
  @ApiResponse({ status: 200, description: 'Game activated successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async activate(@Param('id') id: string) {
    return this.gameService.activateGame(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a game' })
  @ApiResponse({ status: 200, description: 'Game deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async deactivate(@Param('id') id: string) {
    return this.gameService.deactivateGame(id);
  }
}
