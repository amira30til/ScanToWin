import { ApiProperty } from '@nestjs/swagger';
import { Admin } from 'src/modules/admins/entities/admin.entity';
import { Game } from 'src/modules/game/entities/game.entity';
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
} from 'typeorm';

@Entity()
export class ActiveGameAssignment {
  @PrimaryGeneratedColumn()
  id: number;
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
  adminId: number;

  @ManyToOne(() => Game, (game) => game.activeGameAssignments)
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column({ nullable: true })
  gameId: number;
  @OneToMany(() => UserGame, (userGame) => userGame.activeGameAssignment)
  userGames: UserGame[];

  @ManyToOne(() => Shop, (shop) => shop.activeGameAssignments)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @Column()
  shopId: number;
  @ApiProperty()
  @Column({ default: false })
  isActive: boolean;
}
