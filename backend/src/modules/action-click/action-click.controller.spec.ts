import { Test, TestingModule } from '@nestjs/testing';
import { ActionClickController } from './action-click.controller';
import { ActionClickService } from './action-click.service';

describe('ActionClickController', () => {
  let controller: ActionClickController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionClickController],
      providers: [ActionClickService],
    }).compile();

    controller = module.get<ActionClickController>(ActionClickController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
