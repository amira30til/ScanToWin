import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class VerifyGameCodeDto {
  @ApiProperty({ example: '4d23c3ae-940e-4f9b-9b87-342a3dc4d6b6' })
  @IsUUID()
  shopId: string;

  @ApiProperty({ example: 123456 })
  @IsNumber()
  gameCodePin: number;

  @ApiProperty({ example: '3609f677-c4dd-4772-8a90-563f6ac1f653' })
  @IsUUID()
  actionId: string;
}
