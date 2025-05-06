import { Test, TestingModule } from '@nestjs/testing';
import { ChosenActionController } from './chosen-action.controller';
import { ChosenActionService } from './chosen-action.service';

describe('ChosenActionController', () => {
  let controller: ChosenActionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChosenActionController],
      providers: [ChosenActionService],
    }).compile();

    controller = module.get<ChosenActionController>(ChosenActionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
