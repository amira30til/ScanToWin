import { ApiProperty } from '@nestjs/swagger';
import { ActiveGameAssignment } from 'src/modules/active-game-assignment/entities/active-game-assignment.entity';
import { Reward } from 'src/modules/reward/entities/reward.entity';
import { Shop } from 'src/modules/shops/entities/shop.entity';
import { User } from 'src/modules/users/entities/user.entity';
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
export class UserGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty()
  @Column({ nullable: true })
  nbPlayedTimes: number;
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

  @ManyToOne(() => User, (user) => user.userGames)
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ nullable: true })
  userId: string;
  @ManyToOne(() => ActiveGameAssignment, (assignment) => assignment.userGames)
  @JoinColumn({ name: 'activeGameAssignmentId' })
  activeGameAssignment: ActiveGameAssignment;
  @Column({ nullable: true })
  activeGameAssignmentId: string;
  @Column({ nullable: true })
  gameId: string;

  @ApiProperty()
  @Column({ default: 1 })
  playCount: number;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastPlayedAt: Date;
  @ManyToOne(() => Reward, { nullable: true })
  @JoinColumn({ name: 'rewardId' })
  reward: Reward;

  @Column({ nullable: true })
  rewardId: string;
  @Column({ nullable: true })
  shopId: string;

  @ManyToOne(() => Shop)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;
}
