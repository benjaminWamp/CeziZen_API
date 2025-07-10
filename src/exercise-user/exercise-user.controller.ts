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
import { ExerciseUserService } from './exercise-user.service';
import { CreateExerciseUserDto } from './dto/create-exercise-user.dto';
import { UpdateExerciseUserDto } from './dto/update-exercise-user.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { ExerciseUserType } from 'src/utils/types/PrismaApiModel.type';

@Controller('exercise-user')
export class ExerciseUserController {
  constructor(private readonly exerciseUserService: ExerciseUserService) {}

  @Post()
  create(
    @Body() createExerciseUserDto: CreateExerciseUserDto,
  ): Promise<ApiReturns<ExerciseUserType | null>> {
    return this.exerciseUserService.create(createExerciseUserDto);
  }

  @Get()
  findAll(): Promise<ApiReturns<ExerciseUserType[] | null>> {
    return this.exerciseUserService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiReturns<ExerciseUserType | null>> {
    return this.exerciseUserService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExerciseUserDto: UpdateExerciseUserDto,
  ): Promise<ApiReturns<ExerciseUserType>> {
    return this.exerciseUserService.update(id, updateExerciseUserDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string | { message: string }> {
    return this.exerciseUserService.remove(id);
  }
}
