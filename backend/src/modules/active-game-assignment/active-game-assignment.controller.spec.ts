import { Test, TestingModule } from '@nestjs/testing';
import { ChosenGameController } from './active-game-assignment.controller';
import { ChosenGameService } from './active-game-assignment.service';

describe('ChosenGameController', () => {
  let controller: ChosenGameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChosenGameController],
      providers: [ChosenGameService],
    }).compile();

    controller = module.get<ChosenGameController>(ChosenGameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
