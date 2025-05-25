import { ApiProperty } from '@nestjs/swagger';
import { RewardCategory } from '../../reward-category/entities/reward-category.entity';
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
  @Column({ nullable: true })
  winnerCount: number;
  @ApiProperty()
  @Column({ nullable: true })
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
  @ManyToOne(() => RewardCategory, (category) => category.rewards, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: RewardCategory;

  @ApiProperty()
  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne(() => Shop, (shop) => shop.rewards)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @Column({ nullable: true })
  shopId: string;
}
