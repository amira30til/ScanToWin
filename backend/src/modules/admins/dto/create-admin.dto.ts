// create-admin.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../enums/role.enum';
import { AdminStatus } from '../enums/admin-status.enum';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Admin first name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Admin last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  //the email update disabled in the club  should i removed it ?
  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  @ApiProperty({
   example: 'StrongP@ss123' ,
    description:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password is too weak. Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character:[@$!%*?&]',
    },
  )
  password: string;
  @ApiPropertyOptional({
    description: 'Admin role',
    enum: Role,
    default: Role.ADMIN,
    example: Role.ADMIN,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: string;


  @ApiPropertyOptional({
    description: 'Admin status',
    enum: AdminStatus,
    default: AdminStatus.ACTIVE,
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
}
