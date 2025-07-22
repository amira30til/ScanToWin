import { Test, TestingModule } from '@nestjs/testing';
import { RewardRedemptionController } from './reward-redemption.controller';
import { RewardRedemptionService } from './reward-redemption.service';

describe('RewardRedemptionController', () => {
  let controller: RewardRedemptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardRedemptionController],
      providers: [RewardRedemptionService],
    }).compile();

    controller = module.get<RewardRedemptionController>(RewardRedemptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
