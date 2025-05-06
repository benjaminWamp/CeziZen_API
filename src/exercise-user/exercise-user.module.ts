import { Module } from '@nestjs/common';
import { ExerciseUserService } from './exercise-user.service';
import { ExerciseUserController } from './exercise-user.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ExerciseUserController],
  providers: [ExerciseUserService, PrismaService],
})
export class ExerciseUserModule {}
