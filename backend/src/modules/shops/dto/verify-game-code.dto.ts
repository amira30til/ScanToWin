import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class VerifyGameCodeDto {
  @ApiProperty({ example: '4d23c3ae-940e-4f9b-9b87-342a3dc4d6b6' })
  @IsUUID()
  shopId: string;

  @ApiProperty({ example: 123456 })
  @IsString()
  gameCodePin: string;

  @ApiProperty({ example: '3609f677-c4dd-4772-8a90-563f6ac1f653' })
  @IsUUID()
  actionId: string;
  @ApiProperty({ example: 'b1bb4799-7e63-4cb9-8bbf-5a12390f0f52' })
  @IsUUID()
  userId: string;
}
