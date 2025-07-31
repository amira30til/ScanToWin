import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GamePlayTrackingService } from './game-play-tracking.service';
import { CreateGamePlayTrackingDto } from './dto/create-game-play-tracking.dto';
import { UpdateGamePlayTrackingDto } from './dto/update-game-play-tracking.dto';

@Controller('game-play-tracking')
export class GamePlayTrackingController {
  constructor(private readonly gamePlayTrackingService: GamePlayTrackingService) {}

  @Post()
  create(@Body() createGamePlayTrackingDto: CreateGamePlayTrackingDto) {
    return this.gamePlayTrackingService.create(createGamePlayTrackingDto);
  }

  @Get()
  findAll() {
    return this.gamePlayTrackingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamePlayTrackingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGamePlayTrackingDto: UpdateGamePlayTrackingDto) {
    return this.gamePlayTrackingService.update(+id, updateGamePlayTrackingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamePlayTrackingService.remove(+id);
  }
}
