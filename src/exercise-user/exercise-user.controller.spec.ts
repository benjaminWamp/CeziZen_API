import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseUserController } from './exercise-user.controller';
import { ExerciseUserService } from './exercise-user.service';

describe('ExerciseUserController', () => {
  let controller: ExerciseUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseUserController],
      providers: [ExerciseUserService],
    }).compile();

    controller = module.get<ExerciseUserController>(ExerciseUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
