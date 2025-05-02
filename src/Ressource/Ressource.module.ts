import { Module } from '@nestjs/common';
import { RessourceService } from './Ressource.service';
import { RessourceController } from './Ressource.controller';
import { PrismaService } from 'src/prisma.service';
import { StepService } from 'src/step/step.service';

@Module({
  controllers: [RessourceController],
  providers: [RessourceService, PrismaService, StepService],
})
export class RessourceModule {}
