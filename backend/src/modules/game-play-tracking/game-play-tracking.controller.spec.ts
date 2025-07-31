import { Test, TestingModule } from '@nestjs/testing';
import { GamePlayTrackingController } from './game-play-tracking.controller';
import { GamePlayTrackingService } from './game-play-tracking.service';

describe('GamePlayTrackingController', () => {
  let controller: GamePlayTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamePlayTrackingController],
      providers: [GamePlayTrackingService],
    }).compile();

    controller = module.get<GamePlayTrackingController>(GamePlayTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
