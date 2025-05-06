import { Injectable } from '@nestjs/common';
import { CreatePermessionDto } from './dto/create-permession.dto';
import { UpdatePermessionDto } from './dto/update-permession.dto';

@Injectable()
export class PermessionService {
  create(createPermessionDto: CreatePermessionDto) {
    return 'This action adds a new permession';
  }

  findAll() {
    return `This action returns all permession`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permession`;
  }

  update(id: number, updatePermessionDto: UpdatePermessionDto) {
    return `This action updates a #${id} permession`;
  }

  remove(id: number) {
    return `This action removes a #${id} permession`;
  }
}
