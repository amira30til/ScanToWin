import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRewardCategoryDto {
  @ApiProperty({
    description: 'Name of the reward category',
    example: 'Drinks',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
