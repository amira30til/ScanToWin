import { Test, TestingModule } from '@nestjs/testing';
import { PermessionController } from './permission.controller';
import { PermissionService } from './permission.service';

describe('PermessionController', () => {
  let controller: PermessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermessionController],
      providers: [PermissionService],
    }).compile();

    controller = module.get<PermessionController>(PermessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
