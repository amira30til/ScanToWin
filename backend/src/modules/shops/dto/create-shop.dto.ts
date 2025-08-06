import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateShopDto {
  @ApiProperty({
    description: 'Name of the shop',
    example: 'Shop1',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Address of the shop',
    required: false,
    example: '123 Main Street',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'City where the shop is located',
    required: false,
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Country where the shop is located',
    required: false,
    example: 'USA',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'Zip code of the shop location',
    required: false,
    example: 10001,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  zipCode?: number;

  @ApiProperty({
    description: 'SIRET number of the shop',
    required: false,
    example: 12345678900000,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  nbSiret?: number;

  @ApiProperty({
    description: 'Telephone number of the shop',
    required: false,
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  tel?: string;

  @ApiProperty({
    description: 'Primary game color',
    required: false,
    example: '#FF5733',
  })
  @IsOptional()
  @IsString()
  gameColor1?: string;

  @ApiProperty({
    description: 'Secondary game color',
    required: false,
    example: '#33FFBD',
  })
  @IsOptional()
  @IsString()
  gameColor2?: string;

  @ApiProperty({
    description: 'Game code pin',
    required: false,
    example: 1234,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  gameCodePin?: number;

  @ApiProperty({
    description: 'Whether the shop guarantees a win',
    required: false,
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isGuaranteedWin?: boolean;

  @ApiProperty({
    description: 'Logo URL of the shop',
    required: false,
    example: 'https://example.com/logo.png',
  })
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  logo?: any;
}
