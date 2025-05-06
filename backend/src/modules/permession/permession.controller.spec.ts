import { Test, TestingModule } from '@nestjs/testing';
import { PermessionController } from './permession.controller';
import { PermessionService } from './permession.service';

describe('PermessionController', () => {
  let controller: PermessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermessionController],
      providers: [PermessionService],
    }).compile();

    controller = module.get<PermessionController>(PermessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
