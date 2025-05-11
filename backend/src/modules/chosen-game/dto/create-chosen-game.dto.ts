import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateChosenGameDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  qrCodeLink?: string;

  @ApiProperty()
  @IsNumber()
  adminId: number;

  @ApiProperty()
  @IsNumber()
  gameId: number;
}
