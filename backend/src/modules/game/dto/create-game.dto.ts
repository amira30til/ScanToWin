import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { GameStatus } from '../enums/game-status.enums';

export class CreateGameDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, default: GameStatus.ACTIVE })
  @IsOptional()
  status?: GameStatus;
  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  pictureUrl?: any;
}
