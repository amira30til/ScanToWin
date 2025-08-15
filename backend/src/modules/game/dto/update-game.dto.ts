import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { GameStatus } from '../enums/game-status.enums';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, default: GameStatus.ACTIVE })
  @IsString()
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
