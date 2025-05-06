import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { AdminStatus } from '../enums/admin-status.enum';

@Entity()
@Unique(['email'])
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column({ nullable: true })
  firstName: string;
  @ApiProperty()
  @Column({ nullable: true })
  lastName: string;
  @ApiProperty()
  @Column({ nullable: true })
  email: string;
  @ApiProperty()
  @Column({ select: false })
  password: string;
  @Column({ default: Role.ADMIN })
  role: string;
  @ApiProperty()
  @Column({ nullable: true })
  country: string;
  @ApiProperty()
  @Column({ nullable: true })
  city: string;
  @ApiProperty()
  @Column({ default: 0 })
  zipCode: number;
  @ApiProperty()
  @Column({ type: 'varchar', length: 64, nullable: true, default: null })
  verificationCode: string | null;
  @ApiProperty()
  @Column({ nullable: true })
  tel: number;
  @ApiProperty()
  @Column({ nullable: true, type: 'text' })
  refreshToken: string | null;
  @ApiProperty()
  @Column({ nullable: true })
  resetToken: string;
  @ApiProperty()
  @Column({ nullable: true })
  resetTokenExp: Date;
  @ApiProperty()
  @Column({ default: AdminStatus.ACTIVE })
  adminStatus: string;
  @ApiProperty()
  @Column({ nullable: true })
  profilPicture: string;
  @ApiProperty()
  @Column({ nullable: true })
  mailStatus: boolean;
  @ApiProperty()
  @Column({ type: 'bigint', nullable: true })
  nbSiret: number;
  @ApiProperty()
  @Column({ nullable: true })
  gameColor1: string;
  @ApiProperty()
  @Column({ nullable: true })
  gameColor2: string;
  @ApiProperty()
  @Column({ nullable: true })
  gameCodePin: number;
  @ApiProperty()
  @Column({ nullable: true })
  isGuaranteedWin: boolean;
  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
