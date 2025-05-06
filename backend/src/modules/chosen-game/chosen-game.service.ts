import { Injectable } from '@nestjs/common';
import { CreateChosenGameDto } from './dto/create-chosen-game.dto';
import { UpdateChosenGameDto } from './dto/update-chosen-game.dto';

@Injectable()
export class ChosenGameService {
  create(createChosenGameDto: CreateChosenGameDto) {
    return 'This action adds a new chosenGame';
  }

  findAll() {
    return `This action returns all chosenGame`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chosenGame`;
  }

  update(id: number, updateChosenGameDto: UpdateChosenGameDto) {
    return `This action updates a #${id} chosenGame`;
  }

  remove(id: number) {
    return `This action removes a #${id} chosenGame`;
  }
}
