import { PartialType } from '@nestjs/mapped-types';
import { SetActiveGameDto } from './create-active-game-assignment.dto';

export class UpdateActiveGameAssignmentDto extends PartialType(
  SetActiveGameDto,
) {}
