import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class SetActiveGameDto {
  @ApiProperty({
    description: 'ID of the game to set as active',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  gameId: number;
}
