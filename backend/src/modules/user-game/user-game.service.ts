import { Injectable } from '@nestjs/common';
import { CreateUserGameDto } from './dto/create-user-game.dto';
import { UpdateUserGameDto } from './dto/update-user-game.dto';

@Injectable()
export class UserGameService {
  create(createUserGameDto: CreateUserGameDto) {
    return 'This action adds a new userGame';
  }

  findAll() {
    return `This action returns all userGame`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userGame`;
  }

  update(id: number, updateUserGameDto: UpdateUserGameDto) {
    return `This action updates a #${id} userGame`;
  }

  remove(id: number) {
    return `This action removes a #${id} userGame`;
  }
}
