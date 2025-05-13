import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { Shop } from './entities/shop.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../admins/entities/admin.entity';
import { JwtService } from '@nestjs/jwt';
import { ChosenGame } from '../chosen-game/entities/chosen-game.entity';
import { Game } from '../game/entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, Admin, ChosenGame, Game])],
  controllers: [ShopsController],
  providers: [ShopsService, JwtService],
  exports: [ShopsService],
})
export class ShopsModule {}
