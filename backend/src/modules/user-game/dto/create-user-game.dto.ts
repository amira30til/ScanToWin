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
