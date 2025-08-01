import { Test, TestingModule } from '@nestjs/testing';
import { GamePlayTrackingService } from './game-play-tracking.service';

describe('GamePlayTrackingService', () => {
  let service: GamePlayTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamePlayTrackingService],
    }).compile();

    service = module.get<GamePlayTrackingService>(GamePlayTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
