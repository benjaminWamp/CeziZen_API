import { Module } from '@nestjs/common';
import { ProgressionService } from './progression.service';
import { ProgressionController } from './progression.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ProgressionController],
  providers: [ProgressionService, PrismaService],
})
export class ProgressionModule {}
