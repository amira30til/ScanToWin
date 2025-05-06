import { Test, TestingModule } from '@nestjs/testing';
import { PermessionService } from './permession.service';

describe('PermessionService', () => {
  let service: PermessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermessionService],
    }).compile();

    service = module.get<PermessionService>(PermessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
