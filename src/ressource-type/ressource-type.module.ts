import { Module } from '@nestjs/common';
import { TypeRessourceService } from './ressource-type.service';
import { RessourceTypeController } from './ressource-type.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RessourceTypeController],
  providers: [TypeRessourceService, PrismaService],
})
export class RessourceTypeModule {}
