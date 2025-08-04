import { Module } from '@nestjs/common';
import { ChosenActionService } from './chosen-action.service';
import { ChosenActionController } from './chosen-action.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChosenAction } from './entities/chosen-action.entity';
import { Action } from '../actions/entities/action.entity';
import { ActionClick } from '../action-click/entities/action-click.entity';
import { Shop } from '../shops/entities/shop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChosenAction, Action, ActionClick, Shop]),
  ],
  controllers: [ChosenActionController],
  providers: [ChosenActionService],
  exports: [ChosenActionService],
})
export class ChosenActionModule {}
