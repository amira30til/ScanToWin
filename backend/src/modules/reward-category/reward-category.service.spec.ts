import { Test, TestingModule } from '@nestjs/testing';
import { RewardCategoryService } from './reward-category.service';

describe('RewardCategoryService', () => {
  let service: RewardCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RewardCategoryService],
    }).compile();

    service = module.get<RewardCategoryService>(RewardCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
