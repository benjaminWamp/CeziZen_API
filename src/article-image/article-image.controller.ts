
import { Controller, Post, Put, Param, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, File  } from 'multer';
import { extname } from 'path';
import { ArticleImageService } from './article-image.service';

type FileNameCallback = (error: Error | null, filename: string) => void;

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
        callback: (error: null, filename: string) => void
      ) => {
        const uniqueSuffix: string = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext: string = extname(file.originalname);
        callback(null, `article-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: File) {
    const path: string = `/uploads/article-images/${file.filename}`;
    const image: { id: number; path: string } = await this.articleImageService.create({ path });
    return { message: 'Image enregistrée', data: image };
  }

  @Put(':id/image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/article-images',
      filename: (
        req: Request,
        file: File,
        callback: FileNameCallback
      ) => {
        const name: string = `article-${Date.now()}${extname(file.originalname)}`;
        callback(null, name);
      },
    }),
  }))
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: File,
  ) {
    const imagePath: string = `/uploads/article-images/${file.filename}`;
    return this.articleImageService.updateArticleImage(id, imagePath);
  }
}
