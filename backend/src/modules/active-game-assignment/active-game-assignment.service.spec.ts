import { Test, TestingModule } from '@nestjs/testing';
import { ChosenGameService } from './active-game-assignment.service';

describe('ChosenGameService', () => {
  let service: ChosenGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChosenGameService],
    }).compile();

    service = module.get<ChosenGameService>(ChosenGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
