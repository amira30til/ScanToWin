import { Test, TestingModule } from '@nestjs/testing';
import { ChosenActionService } from './chosen-action.service';

describe('ChosenActionService', () => {
  let service: ChosenActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChosenActionService],
    }).compile();

    service = module.get<ChosenActionService>(ChosenActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
