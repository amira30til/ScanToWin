import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChosenGameService } from './chosen-game.service';
import { CreateChosenGameDto } from './dto/create-chosen-game.dto';
import { UpdateChosenGameDto } from './dto/update-chosen-game.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('chosen-game')
export class ChosenGameController {
  constructor(private readonly chosenGameService: ChosenGameService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chosen game' })
  @ApiResponse({ status: 201, description: 'Chosen game created successfully' })
  async create(@Body() createDto: CreateChosenGameDto) {
    return this.chosenGameService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all chosen games' })
  @ApiResponse({
    status: 200,
    description: 'Chosen games fetched successfully',
  })
  async findAll() {
    return this.chosenGameService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chosen game by ID' })
  @ApiResponse({ status: 200, description: 'Chosen game fetched successfully' })
  @ApiResponse({ status: 404, description: 'Chosen game not found' })
  async findOne(@Param('id') id: string) {
    return this.chosenGameService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a chosen game' })
  @ApiResponse({ status: 200, description: 'Chosen game updated successfully' })
  @ApiResponse({ status: 404, description: 'Chosen game not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateChosenGameDto,
  ) {
    return this.chosenGameService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chosen game' })
  @ApiResponse({ status: 200, description: 'Chosen game deleted successfully' })
  @ApiResponse({ status: 404, description: 'Chosen game not found' })
  async remove(@Param('id') id: string) {
    return this.chosenGameService.remove(+id);
  }

  @Get('by-admin/:adminId')
  @ApiOperation({ summary: 'Get chosen games by admin ID' })
  @ApiResponse({
    status: 200,
    description: 'Chosen games fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async findByAdmin(@Param('adminId') adminId: string) {
    return this.chosenGameService.findByAdmin(+adminId);
  }

  @Get('by-game/:gameId')
  @ApiOperation({ summary: 'Get chosen games by game ID' })
  @ApiResponse({
    status: 200,
    description: 'Chosen games fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async findByGame(@Param('gameId') gameId: string) {
    return this.chosenGameService.findByGame(+gameId);
  }
}
