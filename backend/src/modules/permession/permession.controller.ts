import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermessionService } from './permession.service';
import { CreatePermessionDto } from './dto/create-permession.dto';
import { UpdatePermessionDto } from './dto/update-permession.dto';

@Controller('permession')
export class PermessionController {
  constructor(private readonly permessionService: PermessionService) {}

  @Post()
  create(@Body() createPermessionDto: CreatePermessionDto) {
    return this.permessionService.create(createPermessionDto);
  }

  @Get()
  findAll() {
    return this.permessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permessionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermessionDto: UpdatePermessionDto) {
    return this.permessionService.update(+id, updatePermessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permessionService.remove(+id);
  }
}
