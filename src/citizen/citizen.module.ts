import { Module } from '@nestjs/common';
import { CitizenService } from './citizen.service';
import { CitizenController } from './citizen.controller';
import { PrismaService } from 'src/prisma.service';
import { ClerkService } from 'src/auth/clerk.service';

@Module({
  controllers: [CitizenController],
  providers: [CitizenService, PrismaService, ClerkService],
})
export class CitizenModule {}
