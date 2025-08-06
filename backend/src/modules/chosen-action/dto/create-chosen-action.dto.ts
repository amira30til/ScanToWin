import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateOrUpdateChosenActionItemDto {
  @ApiProperty({
    description: 'ID of the chosen action (optional for create)',
    example: 'uuid-string',
    required: false,
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Name of the chosen action',
    example: 'Special Offer',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Position/order of the chosen action',
    example: 1,
    required: true,
  })
  @IsNumber()
  position: number;

  @ApiProperty({
    description: 'Target link for the chosen action',
    example: 'https://example.com/special-offer',
    required: false,
  })
  @IsString()
  @IsOptional()
  targetLink?: string;

  @ApiProperty({
    description: 'Action ID reference',
    example: 'uuid-string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  actionId: string;

  @ApiProperty({
    description: 'Shop ID for the chosen action',
    example: 'uuid-string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  shopId: string;
}

export class UpsertChosenActionsDto {
  @ApiProperty({
    description: 'Shop ID',
    example: 'shop-uuid',
  })
  @IsString()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty({
    description: 'Array of chosen actions to create/update/delete',
    type: [CreateOrUpdateChosenActionItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrUpdateChosenActionItemDto)
  chosenActions: CreateOrUpdateChosenActionItemDto[];
}
