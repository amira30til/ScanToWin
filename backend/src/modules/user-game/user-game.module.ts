import { Module } from '@nestjs/common';
import { UserGameService } from './user-game.service';
import { UserGameController } from './user-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGame } from './entities/user-game.entity';
import { User } from '../users/entities/user.entity';
import { ActiveGameAssignment } from '../active-game-assignment/entities/active-game-assignment.entity';
import { ActiveGameAssignmentService } from '../active-game-assignment/active-game-assignment.service';
import { Game } from '../game/entities/game.entity';
import { AdminsService } from '../admins/admins.service';
import { Shop } from '../shops/entities/shop.entity';
import { Admin } from '../admins/entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserGame,
      User,
      ActiveGameAssignment,
      Game,
      Shop,
      Admin,
    ]),
  ],
  controllers: [UserGameController],
  providers: [UserGameService, ActiveGameAssignmentService, AdminsService],
  exports: [UserGameService],
})
export class UserGameModule {}
