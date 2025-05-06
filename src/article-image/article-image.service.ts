import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateArticleImageDto } from './dto/create-article-image.dto';
import { UpdateArticleImageDto } from './dto/update-article-image.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArticleImageService {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(dto: CreateArticleImageDto) {
    try {
      return await this.prisma.articleImage.create({
        data: {
          path: dto.path,
          articles: dto.articleIds
            ? { connect: dto.articleIds.map((id) => ({ id })) }
            : undefined,
        },
      });
    } catch {
      throw new InternalServerErrorException('Erreur lors de la création de l’image');
    }
  }

  async updateArticleImage(articleId: number, newImagePath: string) {
    const fs = require('fs');

    const previousImages = await this.prisma.article.findUnique({
      where: { id: articleId },
      include: { articleImages: true },
    });
    
    if (previousImages) {
      for (const image of previousImages.articleImages) {
        const fullPath = 'uploads/article-images/' + image.path.split('/').pop();
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        await this.prisma.articleImage.delete({ where: { id: image.id } });
      }
    }
    
    const newImage = await this.prisma.articleImage.create({
      data: { path: newImagePath },
    });
  
    const updatedArticle = await this.prisma.article.update({
      where: { id: articleId },
      data: {
        articleImages: {
          set: [{ id: newImage.id }],
        },
      },
      include: { articleImages: true },
    });
  
    return {
      message: 'Image de l’article mise à jour avec succès',
      data: updatedArticle,
    };
  }
}
