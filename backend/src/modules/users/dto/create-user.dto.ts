import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'Dan ',
  })
  @IsString()
  firstName: string;

  //should we keep the last name or we stick with one filed as name so the user can enter both or just one
  @ApiProperty({
    description: 'User last name',
    example: 'Swift ',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: 123456789,
  })
  @IsOptional()
  @IsString()
  tel?: string;
  @ApiProperty({ default: false })
  @IsOptional()
  agreeToPromotions: boolean;
  @ApiProperty({
    description: 'Shop ID',
    example: 'shop-uuid-here',
  })
  @IsString()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty({
    description: 'Reward ID',
    example: 'reward-uuid-here',
  })
  @IsString()
  @IsNotEmpty()
  rewardId: string;
}
