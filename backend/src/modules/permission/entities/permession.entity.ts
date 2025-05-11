import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionPermission } from 'src/modules/subscription-permission/entities/subscription-permission.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column({ nullable: true })
  key: string;
  @ApiProperty()
  @Column({ nullable: true })
  description: string;
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
    (subscriptionPermission) => subscriptionPermission.permission,
  )
  subscriptionPermissions: SubscriptionPermission[];
}
