import { Test, TestingModule } from '@nestjs/testing';
import { ActiveGameAssignmentService } from './active-game-assignment.service';

describe('ActiveGameAssignmentService', () => {
  let service: ActiveGameAssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActiveGameAssignmentService],
    }).compile();

    service = module.get<ActiveGameAssignmentService>(
      ActiveGameAssignmentService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
