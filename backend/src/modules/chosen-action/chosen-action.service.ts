import { Injectable } from '@nestjs/common';
import { CreateChosenActionDto } from './dto/create-chosen-action.dto';
import { UpdateChosenActionDto } from './dto/update-chosen-action.dto';

@Injectable()
export class ChosenActionService {
  create(createChosenActionDto: CreateChosenActionDto) {
    return 'This action adds a new chosenAction';
  }

  findAll() {
    return `This action returns all chosenAction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chosenAction`;
  }

  update(id: number, updateChosenActionDto: UpdateChosenActionDto) {
    return `This action updates a #${id} chosenAction`;
  }

  remove(id: number) {
    return `This action removes a #${id} chosenAction`;
  }
}
