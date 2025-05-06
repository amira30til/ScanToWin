import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AdminStatus } from '../enums/admin-status.enum';
import { Role } from '../enums/role.enum';

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
    description:
      'Admin password (min 8 chars with at least 1 letter and 1 number)',
    example: 'NewPassword123',
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'Password must contain at least 1 letter and 1 number',
  })
  password?: string;

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
    description: 'Admin zip code',
    example: 10001,
  })
  @IsNumber()
  @IsOptional()
  zipCode?: number;

  @ApiPropertyOptional({
    description: 'Admin phone number',
    example: 123456789,
  })
  @IsNumber()
  @IsOptional()
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
    description: 'Admin profile picture URL',
    example: 'https://example.com/profile.jpg',
  })
  @IsString()
  @IsOptional()
  profilPicture?: string;

  @ApiPropertyOptional({
    description: 'Admin mail status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  mailStatus?: boolean;

  @ApiPropertyOptional({
    description: 'Admin SIRET number (France)',
    example: 12345678900010,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  nbSiret?: number;

  @ApiPropertyOptional({
    description: 'Game primary color (HEX code)',
    example: '#FF5733',
  })
  @IsString()
  @IsOptional()
  gameColor1?: string;

  @ApiPropertyOptional({
    description: 'Game secondary color (HEX code)',
    example: '#33FF57',
  })
  @IsString()
  @IsOptional()
  gameColor2?: string;

  @ApiPropertyOptional({
    description: 'Game PIN code',
    example: 1234,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  gameCodePin?: number;

  @ApiPropertyOptional({
    description: 'Is guaranteed win flag',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isGuaranteedWin?: boolean;
}
