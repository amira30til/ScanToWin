import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { SuperAdminGuard } from '../auth/guards/admins.guard';
import { GameStatus } from './enums/game-status.enums';
import { Game } from './entities/game.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @UseInterceptors(FileInterceptor('pictureUrl'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateGameDto })
  @Post()
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({ status: 201, description: 'Game created successfully' })
  async create(
    @Body() createGameDto: CreateGameDto,
    @UploadedFile() pictureUrl: Express.Multer.File,
  ) {
    return this.gameService.create(createGameDto, pictureUrl);
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

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @UseInterceptors(FileInterceptor('pictureUrl'))
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a game' })
  @ApiResponse({ status: 200, description: 'Game updated successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateGameDto })
  async update(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
    @UploadedFile() pictureUrl: Express.Multer.File,
  ) {
    return this.gameService.update(id, updateGameDto, pictureUrl);
  }

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a game' })
  @ApiResponse({ status: 200, description: 'Game deleted successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async remove(@Param('id') id: string) {
    return this.gameService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a game' })
  @ApiResponse({ status: 200, description: 'Game activated successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async activate(@Param('id') id: string) {
    return this.gameService.activateGame(id);
  }

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a game' })
  @ApiResponse({ status: 200, description: 'Game deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async deactivate(@Param('id') id: string) {
    return this.gameService.deactivateGame(id);
  }
  @Get('by-status')
  @ApiOperation({ summary: 'Fetch games by status' })
  @ApiQuery({ name: 'status', enum: GameStatus, required: true })
  @ApiResponse({
    status: 200,
    description: 'Games fetched successfully',
    type: [Game],
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getGamesByStatus(@Query('status') status: GameStatus) {
    return this.gameService.getGamesByStatus(status);
  }
}
