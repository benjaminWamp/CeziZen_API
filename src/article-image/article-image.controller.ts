import { Controller,  Post,  Put, Param,  UseInterceptors, UploadedFile } from '@nestjs/common';
import { ArticleImageService } from './article-image.service';
import { CreateArticleImageDto } from './dto/create-article-image.dto';
import { UpdateArticleImageDto } from './dto/update-article-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, File } from 'multer';
import { extname } from 'path';

@Controller('article-image')
export class ArticleImageController {
  constructor(private readonly articleImageService: ArticleImageService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/article-images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `article-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: File) {
    const path = `/uploads/article-images/${file.filename}`;
    const image = await this.articleImageService.create({ path });
    return { message: 'Image enregistrée', data: image };
  }


  @Put(':id/image')
@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads/article-images',
    filename: (req, file, cb) => {
      const name = `article-${Date.now()}${extname(file.originalname)}`;
      cb(null, name);
    },
  }),
}))
async updateImage(
  @Param('id') id: string,
  @UploadedFile() file: File,
) {
  const imagePath = `/uploads/article-images/${file.filename}`;
  return this.articleImageService.updateArticleImage(+id, imagePath);
}
}
