import { ApiProperty } from '@nestjs/swagger';
import { ChosenGame } from 'src/modules/chosen-game/entities/chosen-game.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ShopStatus } from '../enums/shop-status.enum';
import { Admin } from 'src/modules/admins/entities/admin.entity';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  logo: string;

  @ApiProperty()
  @Column({ nullable: true })
  address: string;

  @ApiProperty()
  @Column({ nullable: true })
  city: string;

  @ApiProperty()
  @Column({ nullable: true })
  country: string;

  @ApiProperty()
  @Column({ default: 0 })
  zipCode: number;

  @ApiProperty()
  @Column({ type: 'bigint', nullable: true })
  nbSiret: number;

  @ApiProperty()
  @Column({ nullable: true })
  tel: string;

  /////////should we keep same email of the first shop or allow them to change the credns
  //   @ApiProperty()
  //   @Column({ nullable: true })
  //   email: string;

  @ApiProperty()
  @Column({ default: ShopStatus.ACTIVE })
  status: string;

  @ApiProperty()
  @Column({ nullable: true })
  gameColor1: string;

  @ApiProperty()
  @Column({ nullable: true })
  gameColor2: string;

  @ApiProperty()
  @Column({ nullable: true })
  gameCodePin: number;

  @ApiProperty()
  @Column({ nullable: true, default: false })
  isGuaranteedWin: boolean;

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

  @ManyToOne(() => Admin, (admin) => admin.shops)
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @Column()
  adminId: number;

  @OneToMany(() => ChosenGame, (chosenGame) => chosenGame.shop)
  chosenGames: ChosenGame[];

  @ApiProperty()
  @Column({ unique: true })
  qrCodeIdentifier: string;
}
