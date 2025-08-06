import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { RewardStatus } from '../enums/reward-status.enums';
import { Shop } from 'src/modules/shops/entities/shop.entity';

@Entity()
export class Reward {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty()
  @Column({ nullable: true })
  name: string;
  @ApiProperty()
  @Column({ nullable: true })
  icon: string;
  @ApiProperty()
  @Column({ nullable: true, default: 0 })
  winnerCount: number; //for dashboard
  @ApiProperty()
  @Column({ nullable: true, default: false })
  isUnlimited: boolean;
  @ApiProperty()
  @Column({ nullable: true, default: RewardStatus.ACTIVE })
  status: RewardStatus;
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

  @ManyToOne(() => Shop, (shop) => shop.rewards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @Column({ nullable: true })
  shopId: string;

  @ApiProperty()
  @Column({ type: 'int', nullable: true })
  nbRewardTowin!: number | null;
  @ApiProperty()
  @Column({ nullable: true })
  percentage: number;
}
