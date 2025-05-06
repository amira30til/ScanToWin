import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChosenGameService } from './chosen-game.service';
import { CreateChosenGameDto } from './dto/create-chosen-game.dto';
import { UpdateChosenGameDto } from './dto/update-chosen-game.dto';

@Controller('chosen-game')
export class ChosenGameController {
  constructor(private readonly chosenGameService: ChosenGameService) {}

  @Post()
  create(@Body() createChosenGameDto: CreateChosenGameDto) {
    return this.chosenGameService.create(createChosenGameDto);
  }

  @Get()
  findAll() {
    return this.chosenGameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chosenGameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChosenGameDto: UpdateChosenGameDto) {
    return this.chosenGameService.update(+id, updateChosenGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chosenGameService.remove(+id);
  }
}
