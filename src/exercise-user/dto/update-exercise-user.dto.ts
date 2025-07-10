import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseUserDto } from './create-exercise-user.dto';

export class UpdateExerciseUserDto extends PartialType(CreateExerciseUserDto) {}
