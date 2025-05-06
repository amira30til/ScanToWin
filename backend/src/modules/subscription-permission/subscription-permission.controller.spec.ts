import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionPermissionController } from './subscription-permission.controller';
import { SubscriptionPermissionService } from './subscription-permission.service';

describe('SubscriptionPermissionController', () => {
  let controller: SubscriptionPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionPermissionController],
      providers: [SubscriptionPermissionService],
    }).compile();

    controller = module.get<SubscriptionPermissionController>(SubscriptionPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
