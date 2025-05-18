import { ApiProperty } from '@nestjs/swagger';
import { ActiveGameAssignment } from 'src/modules/active-game-assignment/entities/active-game-assignment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column({ nullable: true })
  name: string;
  @ApiProperty()
  @Column({ nullable: true })
  isActive: boolean;
  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @ApiProperty()
  @Column({ nullable: true })
  pictureUrl: string;

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
