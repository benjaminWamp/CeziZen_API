import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaService } from 'src/prisma.service';
import { RessourceService } from 'src/Ressource/Ressource.service';
import { ProgressionService } from 'src/progression/progression.service';
import { StepService } from 'src/step/step.service';

@Module({
  controllers: [MessageController],
  providers: [
    MessageService,
    PrismaService,
    RessourceService,
    ProgressionService,
    StepService,
  ],
})
export class MessageModule {}
