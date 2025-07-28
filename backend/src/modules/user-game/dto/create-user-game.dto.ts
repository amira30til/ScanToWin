import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateUserGameDto {
  @ApiProperty()
  @IsNumber()
  userId: string;

  @ApiProperty()
  @IsNumber()
  gameId: string;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  nbPlayedTimes?: number;
}
export class UserGameStatsDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  lastPlayedAt: Date;

  @ApiProperty()
  totalPlayCount: number;

  @ApiProperty()
  favoriteGameId: string;
  @ApiProperty()
  tel: string;
}
