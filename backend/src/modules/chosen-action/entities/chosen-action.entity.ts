import { ApiProperty } from '@nestjs/swagger';
import { Action } from 'src/modules/actions/entities/action.entity';
import { Shop } from 'src/modules/shops/entities/shop.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class ChosenAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty()
  @Column({ nullable: true })
  name: string;
  @ApiProperty()
  @Column({ nullable: true })
  position: number;
  @ApiProperty()
  @Column({ nullable: true })
  targetLink: string;
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

  @ManyToOne(() => Shop, (shop) => shop.chosenActions)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @Column({ nullable: true })
  shopId: string;

  @ManyToOne(() => Action, (action) => action.chosenActions)
  @JoinColumn({ name: 'actionId' })
  action: Action;

  @Column({ nullable: true })
  actionId: string;
  @ApiProperty()
  @Column({ nullable: true, default: 0 })
  redeemedReward: number;

}

