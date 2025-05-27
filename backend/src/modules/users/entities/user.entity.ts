import { ApiProperty } from '@nestjs/swagger';
import { UserGame } from 'src/modules/user-game/entities/user-game.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty()
  @Column({ nullable: true })
  email: string;
  @ApiProperty()
  @Column({ nullable: true })
  firstName: string;
  //should we keep the last name or we stick with one filed as name so the user can enter both or just one
  @ApiProperty()
  @Column({ nullable: true })
  lastName: string;
  @ApiProperty()
  @Column({ nullable: true })
  tel: number;
  @ApiProperty()
  @Column({ nullable: true })
  totalPlayedGames: number;
  @ApiProperty()
  @Column({ nullable: true, default: false })
  agreeToPromotions: boolean;

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
  @OneToMany(() => UserGame, (userGame) => userGame.user)
  userGames: UserGame[];
}
