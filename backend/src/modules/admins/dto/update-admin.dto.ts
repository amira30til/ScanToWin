import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AdminStatus } from '../enums/admin-status.enum';
import { Role } from '../enums/role.enum';
import { Type } from 'class-transformer';

export class UpdateAdminDto implements Partial<CreateAdminDto> {
  @ApiPropertyOptional({
    description: 'Admin first name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Admin last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Admin email address',
    example: 'admin@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Admin role',
    enum: Role,
    example: Role.ADMIN,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    description: 'Admin country',
    example: 'United States',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'Admin city',
    example: 'New York',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    description: 'Admin phone number',
    example: 123456789,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  tel?: number;

  @ApiPropertyOptional({
    description: 'Admin status',
    enum: AdminStatus,
    example: AdminStatus.ACTIVE,
  })
  @IsEnum(AdminStatus)
  @IsOptional()
  adminStatus?: string;

  @ApiPropertyOptional({
    description: 'Admin mail status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  mailStatus?: boolean;

  @ApiPropertyOptional({
    description: 'Admin profile picture URL',
    example: 'https://example.com/profile.jpg',
  })
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  profilPicture?: any;
}
