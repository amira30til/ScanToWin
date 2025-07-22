import { Injectable } from '@nestjs/common';
import { CreateActionClickDto } from './dto/create-action-click.dto';
import { UpdateActionClickDto } from './dto/update-action-click.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionClick } from './entities/action-click.entity';

@Injectable()
export class ActionClickService {
  constructor(
    @InjectRepository(ActionClick)
    private readonly actionClickRepository: Repository<ActionClick>,
  ) {}
  create(createActionClickDto: CreateActionClickDto) {
    return 'This action adds a new actionClick';
  }

  findAll() {
    return `This action returns all actionClick`;
  }

  findOne(id: number) {
    return `This action returns a #${id} actionClick`;
  }

  update(id: number, updateActionClickDto: UpdateActionClickDto) {
    return `This action updates a #${id} actionClick`;
  }

  remove(id: number) {
    return `This action removes a #${id} actionClick`;
  }
}
