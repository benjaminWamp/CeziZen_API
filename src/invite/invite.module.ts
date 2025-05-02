import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [InviteController],
  providers: [InviteService, PrismaService],
})
export class InviteModule {}
