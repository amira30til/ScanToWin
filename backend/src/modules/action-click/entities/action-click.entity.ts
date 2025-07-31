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

  @ManyToOne(() => ChosenAction, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chosenActionId' })
  chosenAction: ChosenAction;

  @ManyToOne(() => Shop)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;
}
