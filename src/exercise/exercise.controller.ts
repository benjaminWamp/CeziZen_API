import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { ExerciseType } from 'src/utils/types/PrismaApiModel.type';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciceService: ExerciseService) {}

  @Post()
  create(
    @Body() createExerciseDto: CreateExerciseDto,
  ): Promise<ApiReturns<ExerciseType | null>> {
    return this.exerciceService.create(createExerciseDto);
  }

  @Get()
  findAll(): Promise<ApiReturns<ExerciseType[] | null>> {
    return this.exerciceService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiReturns<ExerciseType | null>> {
    return this.exerciceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ): Promise<ApiReturns<ExerciseType>> {
    return this.exerciceService.update(id, updateExerciseDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string | { message: string }> {
    return this.exerciceService.remove(id);
  }
}
