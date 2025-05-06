import { Module } from '@nestjs/common';
import { ChosenGameService } from './chosen-game.service';
import { ChosenGameController } from './chosen-game.controller';

@Module({
  controllers: [ChosenGameController],
  providers: [ChosenGameService],
})
export class ChosenGameModule {}
