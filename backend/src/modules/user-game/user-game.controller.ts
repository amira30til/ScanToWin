import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserGameService } from './user-game.service';
import { CreateUserGameDto } from './dto/create-user-game.dto';
import { UpdateUserGameDto } from './dto/update-user-game.dto';

@Controller('user-game')
export class UserGameController {
  constructor(private readonly userGameService: UserGameService) {}

  @Post()
  create(@Body() createUserGameDto: CreateUserGameDto) {
    return this.userGameService.create(createUserGameDto);
  }

  @Get()
  findAll() {
    return this.userGameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userGameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserGameDto: UpdateUserGameDto) {
    return this.userGameService.update(+id, updateUserGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userGameService.remove(+id);
  }
}
