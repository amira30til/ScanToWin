import { Module } from '@nestjs/common';
import { UserGameService } from './user-game.service';
import { UserGameController } from './user-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGame } from './entities/user-game.entity';
import { User } from '../users/entities/user.entity';
import { ChosenGame } from '../chosen-game/entities/chosen-game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGame, User, ChosenGame])],
  controllers: [UserGameController],
  providers: [UserGameService],
  exports: [UserGameService],
})
export class UserGameModule {}
