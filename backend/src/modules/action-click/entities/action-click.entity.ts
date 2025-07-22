import { ChosenAction } from 'src/modules/chosen-action/entities/chosen-action.entity';
import { Shop } from 'src/modules/shops/entities/shop.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class ActionClick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  clickedAt: Date;

  @ManyToOne(() => ChosenAction, { eager: true })
  @JoinColumn({ name: 'chosenActionId' })
  chosenAction: ChosenAction;

  @ManyToOne(() => Shop, { eager: true })
  @JoinColumn({ name: 'shopId' })
  shop: Shop;
}
