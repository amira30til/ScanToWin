import { PartialType } from '@nestjs/mapped-types';
import { CreateRewardDto } from './create-reward.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { RewardStatus } from '../enums/reward-status.enums';

export class UpdateRewardDto {
  @ApiProperty({
    description: 'Name of the reward',
    example: 'Pizza',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'Icon URL or identifier for the reward',
    example: 'https://example.com/icons/Pizza.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    description: 'Number of winners for this reward',
    example: 0,
    required: false,
  })
  @IsOptional()
  winnerCount?: number;

  @ApiProperty({
    description: 'Whether the reward has unlimited winners',
    example: false,
    required: false,
  })
  @IsOptional()
  isUnlimited?: boolean;

  @ApiProperty({
    description: 'Whether the reward is active',
    example: 'Active',
    required: false,
  })
  @IsOptional()
  status?: RewardStatus;
  @IsOptional()
  id?: string;
}
