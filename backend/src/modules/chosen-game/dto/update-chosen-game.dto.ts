import { PartialType } from '@nestjs/mapped-types';
import { CreateChosenGameDto } from './create-chosen-game.dto';

export class UpdateChosenGameDto extends PartialType(CreateChosenGameDto) {}
