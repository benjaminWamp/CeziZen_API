
import { Controller, Post, Put, Param, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { Express, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, File } from 'multer';
import { extname } from 'path';
import { ArticleImageService } from './article-image.service';

@Controller('article-image')
export class ArticleImageController {
  constructor(private readonly articleImageService: ArticleImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/article-images',
      filename: (
        req: Request,
        file: File,
        callback: (err: Error | null, filename: string) => void
      ) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `article-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: File) {
    const path = `/uploads/article-images/${file.filename}`;
    const image = await this.articleImageService.create({ path });
    return { message: 'Image enregistrée', data: image };
  }

  @Put(':id/image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/article-images',
      filename: (
        req: Request,
        file: File,
        callback: (err: Error | null, filename: string) => void
      ) => {
        const name = `article-${Date.now()}${extname(file.originalname)}`;
        callback(null, name);
      },
    }),
  }))
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: File,
  ) {
    const imagePath = `/uploads/article-images/${file.filename}`;
    return this.articleImageService.updateArticleImage(id, imagePath);
  }
}
