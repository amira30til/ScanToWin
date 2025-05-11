import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { SubscriptionStatus } from '../enums/subscription-plan-staus';
import { SubscriptionType } from '../enums/subscription-type-enum';

export class CreateSubscriptionPlanDto {
  @ApiProperty({
    description: 'Name of the subscription plan',
    example: 'Premium Plan',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Status of the subscription plan',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  @IsEnum(SubscriptionStatus)
  @IsOptional()
  subscriptionStatus?: string;

  @ApiProperty({
    description: 'Monthly price of the subscription',
    example: 9.99,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  monthlyPrice?: number;

  @ApiProperty({
    description: 'Annual price of the subscription',
    example: 99.99,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  annualPrice?: number;

  @ApiProperty({
    description: 'Whether this is a custom plan',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isCustom?: boolean;

  @ApiProperty({
    description: 'Number of days for free trial',
    example: 14,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  freeTrialDays?: number;

  @ApiProperty({
    description: 'Discount percentage',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  discount?: number;

  @ApiProperty({
    description: 'Average reviews rating',
    example: 4.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  averageReviews?: number;

  @ApiProperty({
    description: 'Type of subscription',
    enum: SubscriptionType,
    default: SubscriptionType.MONTHLY,
  })
  @IsEnum(SubscriptionType)
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'Tag for the subscription plan',
    example: 'popular',
    required: false,
  })
  @IsString()
  @IsOptional()
  tag?: string;
}
