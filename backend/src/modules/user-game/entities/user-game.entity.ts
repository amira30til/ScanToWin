import { ApiProperty } from '@nestjs/swagger';
import { ChosenGame } from 'src/modules/chosen-game/entities/chosen-game.entity';
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
  @PrimaryGeneratedColumn()
  id: number;
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
  userId: number;
  @ManyToOne(() => ChosenGame, (chosenGame) => chosenGame.userGames)
  @JoinColumn({ name: 'gameId' })
  game: ChosenGame;
  @Column({ nullable: true })
  gameId: number;
}
