import { Module } from '@nestjs/common';
import { ActionClickService } from './action-click.service';
import { ActionClickController } from './action-click.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionClick } from './entities/action-click.entity';
import { Shop } from '../shops/entities/shop.entity';
import { ChosenAction } from '../chosen-action/entities/chosen-action.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ActionClick, Shop, ChosenAction])],
  controllers: [ActionClickController],
  providers: [ActionClickService,JwtService],
  exports: [ActionClickService],
})
export class ActionClickModule {}
