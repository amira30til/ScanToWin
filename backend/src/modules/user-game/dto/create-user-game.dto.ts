import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateUserGameDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  gameId: number;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  nbPlayedTimes?: number;
}
