import { Module } from '@nestjs/common';
import { GamePlayTrackingService } from './game-play-tracking.service';
import { GamePlayTrackingController } from './game-play-tracking.controller';
import { GamePlayTracking } from './entities/game-play-tracking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChosenAction } from '../chosen-action/entities/chosen-action.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GamePlayTracking, ChosenAction])],

  controllers: [GamePlayTrackingController],
  providers: [GamePlayTrackingService],
  exports: [GamePlayTrackingService],
})
export class GamePlayTrackingModule {}
