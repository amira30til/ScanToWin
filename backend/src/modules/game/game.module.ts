import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '../admins/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Admin])],
  controllers: [GameController],
  providers: [GameService, JwtService],
  exports: [GameService],
})
export class GameModule {}
