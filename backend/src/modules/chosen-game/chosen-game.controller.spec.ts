import { Test, TestingModule } from '@nestjs/testing';
import { ChosenGameController } from './chosen-game.controller';
import { ChosenGameService } from './chosen-game.service';

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
