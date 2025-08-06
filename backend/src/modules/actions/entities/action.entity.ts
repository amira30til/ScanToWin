import { ApiProperty } from '@nestjs/swagger';
import { ChosenAction } from 'src/modules/chosen-action/entities/chosen-action.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class Action {
  @PrimaryGeneratedColumn('uuid')
  id: string;
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
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => ChosenAction, (chosenAction) => chosenAction.action)
  chosenActions: ChosenAction[];
}
