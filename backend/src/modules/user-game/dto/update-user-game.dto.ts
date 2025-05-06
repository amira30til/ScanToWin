import { PartialType } from '@nestjs/mapped-types';
import { CreateUserGameDto } from './create-user-game.dto';

export class UpdateUserGameDto extends PartialType(CreateUserGameDto) {}
