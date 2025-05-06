import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { ClerkService } from 'src/auth/clerk.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, ClerkService],
})
export class UserModule {}
