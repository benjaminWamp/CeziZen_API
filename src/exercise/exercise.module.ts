import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ExerciseController],
  providers: [ExerciseService, PrismaService],
})
export class ExerciseModule {}
