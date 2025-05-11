import { ApiProperty } from '@nestjs/swagger';
import { Admin } from 'src/modules/admins/entities/admin.entity';
import { Game } from 'src/modules/game/entities/game.entity';
import { UserGame } from 'src/modules/user-game/entities/user-game.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class ChosenGame {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column({ nullable: true })
  name: string;
  @ApiProperty()
  @Column({ nullable: true })
  qrCodeLink: string;
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
  @ManyToOne(() => Admin, (admin) => admin.chosenGames)
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @Column({ nullable: true })
  adminId: number;

  @ManyToOne(() => Game, (game) => game.chosenGames)
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column({ nullable: true })
  gameId: number;
  @OneToMany(() => UserGame, (userGame) => userGame.game)
  userGames: UserGame[];
}
