import { Module } from '@nestjs/common';
import { ChosenGameService } from './chosen-game.service';
import { ChosenGameController } from './chosen-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChosenGame } from './entities/chosen-game.entity';
import { Game } from '../game/entities/game.entity';
import { AdminsService } from '../admins/admins.service';
import { Admin } from '../admins/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChosenGame, Game, Admin])],
  controllers: [ChosenGameController],
  providers: [ChosenGameService, AdminsService],
  exports: [ChosenGameService],
})
export class ChosenGameModule {}
