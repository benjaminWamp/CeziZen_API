import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseUserService } from './exercise-user.service';

describe('ExerciseUserService', () => {
  let service: ExerciseUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExerciseUserService],
    }).compile();

    service = module.get<ExerciseUserService>(ExerciseUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
