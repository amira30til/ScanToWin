import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { AdminStatus } from '../enums/admin-status.enum';
import { Shop } from 'src/modules/shops/entities/shop.entity';
import { ActiveGameAssignment } from 'src/modules/active-game-assignment/entities/active-game-assignment.entity';

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
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
  @OneToMany(() => ActiveGameAssignment, (assignment) => assignment.admin)
  activeGameAssignments: ActiveGameAssignment[];
  @OneToMany(() => Shop, (shop) => shop.admin)
  shops: Shop[];
}
