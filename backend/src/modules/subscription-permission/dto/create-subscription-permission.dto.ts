import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubscriptionPermissionDto {
  @ApiProperty({
    description: 'Display order of the permission in the subscription',
    example: 1,
    required: false,
  })
  @IsInt({ message: 'Display order must be an integer' })
  @Min(0, { message: 'Display order must be a non-negative number' })
  @IsOptional()
  @Type(() => Number)
  displayOrder?: number;

  @ApiProperty({
    description: 'Whether the permission is enabled',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Enabled must be a boolean value' })
  @IsOptional()
  @Type(() => Boolean)
  enabled?: boolean;

  @ApiProperty({
    description: 'ID of the associated subscription plan',
    example: 1,
  })
  @IsInt({ message: 'Subscription plan ID must be an integer' })
  @IsNotEmpty({ message: 'Subscription plan ID is required' })
  @Min(1, { message: 'Subscription plan ID must be at least 1' })
  @Type(() => Number)
  subscriptionPlanId: number;

  @ApiProperty({
    description: 'ID of the associated permission',
    example: 1,
  })
  @IsInt({ message: 'Permission ID must be an integer' })
  @IsNotEmpty({ message: 'Permission ID is required' })
  @Min(1, { message: 'Permission ID must be at least 1' })
  @Type(() => Number)
  permissionId: number;
}
