import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Name of the permission',
    example: 'Action disponible',
  })
  key: string;

  @ApiProperty({
    description:
      'Description of what the permission allows if the super admin want to specify more details ',
    example: 'Allows reading user data',
    required: false,
  })
  description?: string;
}
