import { ActiveGameAssignment } from '../../active-game-assignment/entities/active-game-assignment.entity';
import { ChosenAction } from '../../chosen-action/entities/chosen-action.entity';
import { Game } from '../../game/entities/game.entity';
import { Reward } from '../../reward/entities/reward.entity';
import { Shop } from '../../shops/entities/shop.entity';
import { User } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class GamePlayTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  playedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Shop, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @ManyToOne(() => ActiveGameAssignment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activeGameAssignmentId' })
  activeGameAssignment: ActiveGameAssignment;

  @ManyToOne(() => Reward)
  @JoinColumn({ name: 'rewardId' })
  reward: Reward;
  @ManyToOne(() => ChosenAction, { nullable: true })
  @JoinColumn({ name: 'chosenActionId' })
  chosenAction: ChosenAction;
}
