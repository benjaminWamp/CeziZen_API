import { Module } from '@nestjs/common';
import { ArticleImageService } from './article-image.service';
import { ArticleImageController } from './article-image.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ArticleImageController],
  providers: [ArticleImageService, PrismaService],
})
export class ArticleImageModule {}
