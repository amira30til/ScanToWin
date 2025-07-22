import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActionClickService } from './action-click.service';
import { CreateActionClickDto } from './dto/create-action-click.dto';
import { UpdateActionClickDto } from './dto/update-action-click.dto';

@Controller('action-click')
export class ActionClickController {
  constructor(private readonly actionClickService: ActionClickService) {}

  @Post()
  create(@Body() createActionClickDto: CreateActionClickDto) {
    return this.actionClickService.create(createActionClickDto);
  }

  @Get()
  findAll() {
    return this.actionClickService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actionClickService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActionClickDto: UpdateActionClickDto) {
    return this.actionClickService.update(+id, updateActionClickDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actionClickService.remove(+id);
  }
}
