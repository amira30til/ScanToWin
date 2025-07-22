import { PartialType } from '@nestjs/swagger';
import { CreateActionClickDto } from './create-action-click.dto';

export class UpdateActionClickDto extends PartialType(CreateActionClickDto) {}
