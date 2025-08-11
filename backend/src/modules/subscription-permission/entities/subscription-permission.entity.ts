import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../permission/entities/permession.entity';
import { SubscriptionPlan } from '../../subscription-plan/entities/subscription-plan.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SubscriptionPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty()
  @Column({ nullable: true })
  displayOrder: number;
  @ApiProperty()
  @Column({ nullable: true })
  enabled: boolean;
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
  @ManyToOne(
    () => SubscriptionPlan,
    (subscriptionPlan) => subscriptionPlan.subscriptionPermissions,
  )
  @JoinColumn({ name: 'subscriptionPlanId' })
  subscriptionPlan: SubscriptionPlan;
  @Column({ nullable: true })
  subscriptionPlanId: string;

  @ManyToOne(
    () => Permission,
    (permission) => permission.subscriptionPermissions,
  )
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;
  @Column({ nullable: true })
  permissionId: string;
}
