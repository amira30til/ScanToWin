import { Test, TestingModule } from '@nestjs/testing';
import { AdminSubscriptionController } from './admin-subscription.controller';
import { AdminSubscriptionService } from './admin-subscription.service';

describe('AdminSubscriptionController', () => {
  let controller: AdminSubscriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminSubscriptionController],
      providers: [AdminSubscriptionService],
    }).compile();

    controller = module.get<AdminSubscriptionController>(
      AdminSubscriptionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
