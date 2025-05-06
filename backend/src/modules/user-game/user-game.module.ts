import { Module } from '@nestjs/common';
import { UserGameService } from './user-game.service';
import { UserGameController } from './user-game.controller';

@Module({
  controllers: [UserGameController],
  providers: [UserGameService],
})
export class UserGameModule {}
