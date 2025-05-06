import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { BillingPeriodeEnum } from '../enums/billing-periode-enum';

@Entity()
export class AdminSubscription {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column({ default: BillingPeriodeEnum.ACTIVE })
  BillingPeriode: string;
  @ApiProperty()
  @Column({ nullable: true })
  price: number;
  @ApiProperty()
  @Column({ nullable: true })
  isActive: boolean;
  @ApiProperty()
  @Column({ nullable: true })
  canceledAt: Date;
  @ApiProperty()
  @Column({ nullable: true })
  currentPeriodEnd: Date;

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
