import { PartialType } from '@nestjs/swagger';
import { CreateGamePlayTrackingDto } from './create-game-play-tracking.dto';

export class UpdateGamePlayTrackingDto extends PartialType(
  CreateGamePlayTrackingDto,
) {}
