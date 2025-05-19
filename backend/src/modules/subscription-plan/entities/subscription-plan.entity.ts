import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionStatus } from '../enums/subscription-plan-staus';
import { SubscriptionType } from '../enums/subscription-type-enum';
import { SubscriptionPermission } from 'src/modules/subscription-permission/entities/subscription-permission.entity';

@Entity()
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty()
  @Column({ nullable: true })
  name: string;
  @ApiProperty()
  @Column({ default: SubscriptionStatus.ACTIVE })
  subscriptionStatus: string;
  @ApiProperty()
  @Column({ type: 'float', nullable: true })
  monthlyPrice: number;
  @ApiProperty()
  @Column({ type: 'float', nullable: true })
  annualPrice: number;
  @ApiProperty()
  @Column({ nullable: true })
  isCustom: boolean;
  @ApiProperty()
  @Column({ nullable: true })
  freeTrialDays: number;
  @ApiProperty()
  @Column({ nullable: true })
  discount: number;
  @ApiProperty()
  @Column({ type: 'float', nullable: true })
  averageReviews: number;
  @ApiProperty()
  @Column({ default: SubscriptionType.MONTHLY })
  type: string;
  @ApiProperty()
  @Column({ nullable: true })
  tag: string;
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
  @OneToMany(
    () => SubscriptionPermission,
    (subscriptionPermission) => subscriptionPermission.subscriptionPlan,
  )
  subscriptionPermissions: SubscriptionPermission[];
}
