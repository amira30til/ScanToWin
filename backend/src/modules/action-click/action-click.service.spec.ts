import { Test, TestingModule } from '@nestjs/testing';
import { ActionClickService } from './action-click.service';

describe('ActionClickService', () => {
  let service: ActionClickService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionClickService],
    }).compile();

    service = module.get<ActionClickService>(ActionClickService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
