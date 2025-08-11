import { ApiProperty } from '@nestjs/swagger';
import { ActiveGameAssignment } from '../../active-game-assignment/entities/active-game-assignment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { GameStatus } from '../enums/game-status.enums';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty()
  @Column({ nullable: true })
  name: string;
  @ApiProperty()
  @Column({ nullable: true, default: GameStatus.ACTIVE })
  status: GameStatus;
  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @ApiProperty()
  @Column({ nullable: true })
  pictureUrl: string;
  @ApiProperty()
  @Column({ nullable: true })
  description: string;
  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => ActiveGameAssignment, (assignment) => assignment.game)
  activeGameAssignments: ActiveGameAssignment[];
}
