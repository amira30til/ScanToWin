import { ApiProperty } from '@nestjs/swagger';
import { Admin } from 'src/modules/admins/entities/admin.entity';
import { Game } from 'src/modules/game/entities/game.entity';
import { Reward } from 'src/modules/reward/entities/reward.entity';
import { Shop } from 'src/modules/shops/entities/shop.entity';
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
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity()
export class ActiveGameAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // @ApiProperty()
  // @Column({ nullable: true })
  // name: string;

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
  @ManyToOne(() => Admin, (admin) => admin.activeGameAssignments)
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @Column({ nullable: true })
  adminId: string;

  @ManyToOne(() => Game, (game) => game.activeGameAssignments)
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column({ nullable: true })
  gameId: string;
  @OneToMany(() => UserGame, (userGame) => userGame.activeGameAssignment)
  userGames: UserGame[];

  @ManyToOne(() => Shop, (shop) => shop.activeGameAssignments)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @Column({ nullable: true })
  shopId: string;
  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;
  @ManyToMany(() => Reward)
  @JoinTable()
  rewards: Reward[];
}
