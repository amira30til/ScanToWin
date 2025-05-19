import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
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
  icon: string;
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
}
