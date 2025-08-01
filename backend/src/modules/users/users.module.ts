import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGame } from '../user-game/entities/user-game.entity';
import { Reward } from '../reward/entities/reward.entity';
import { ActiveGameAssignment } from '../active-game-assignment/entities/active-game-assignment.entity';
import { MailService } from '../mail/mail.service';
import { GamePlayTracking } from '../game-play-tracking/entities/game-play-tracking.entity';
import { ChosenAction } from '../chosen-action/entities/chosen-action.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserGame, Reward, ActiveGameAssignment, GamePlayTracking, ChosenAction]),
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService],
  exports: [UsersService],
})
export class UsersModule {}
