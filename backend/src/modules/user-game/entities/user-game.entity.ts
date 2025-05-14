import { ApiProperty } from '@nestjs/swagger';
import { ActiveGameAssignment } from 'src/modules/active-game-assignment/entities/active-game-assignment.entity';
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
  @ManyToOne(() => ActiveGameAssignment, (assignment) => assignment.userGames)
  @JoinColumn({ name: 'activeGameAssignmentId' })
  activeGameAssignment: ActiveGameAssignment;
  @Column({ nullable: true })
  activeGameAssignmentId: number;
  @Column({ nullable: true })
  gameId: number;

  @ApiProperty()
  @Column({ default: 1 })
  playCount: number;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastPlayedAt: Date;
}
