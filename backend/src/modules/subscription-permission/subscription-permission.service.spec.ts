import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionPermissionService } from './subscription-permission.service';

describe('SubscriptionPermissionService', () => {
  let service: SubscriptionPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionPermissionService],
    }).compile();

    service = module.get<SubscriptionPermissionService>(SubscriptionPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
