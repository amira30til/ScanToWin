import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { RewardStatus } from '../enums/reward-status.enums';
import { Type } from 'class-transformer';

export class CreateRewardDto {
  @ApiProperty({
    description: 'Name of the reward',
    example: 'Pizza',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

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
    description: 'Number of winners for this rewardaaaaa',
    example: 5,
    required: false,
  })
  @IsOptional()
  nbRewardTowin?: number;

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

  @ApiProperty({
    description: 'shop ID for the reward',
    example: 'uuid-string',
    required: true,
  })
  @IsString()
  shopId: string;
  @ApiProperty({
    description: '% of reward winning',
    example: 10,
    required: false,
  })
  @IsOptional()
  percentage: number;
  @IsOptional()
  id?: string;
}

export class UpsertRewardsDto {
  @ApiProperty({ example: 'shop-uuid' })
  @IsString()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty({ type: [CreateRewardDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRewardDto)
  rewards: CreateRewardDto[];
}
