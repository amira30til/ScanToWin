import { PartialType } from '@nestjs/mapped-types';
import { CreateChosenActionDto } from './create-chosen-action.dto';

export class UpdateChosenActionDto extends PartialType(CreateChosenActionDto) {}
