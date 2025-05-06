import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChosenActionService } from './chosen-action.service';
import { CreateChosenActionDto } from './dto/create-chosen-action.dto';
import { UpdateChosenActionDto } from './dto/update-chosen-action.dto';

@Controller('chosen-action')
export class ChosenActionController {
  constructor(private readonly chosenActionService: ChosenActionService) {}

  @Post()
  create(@Body() createChosenActionDto: CreateChosenActionDto) {
    return this.chosenActionService.create(createChosenActionDto);
  }

  @Get()
  findAll() {
    return this.chosenActionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chosenActionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChosenActionDto: UpdateChosenActionDto) {
    return this.chosenActionService.update(+id, updateChosenActionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chosenActionService.remove(+id);
  }
}
