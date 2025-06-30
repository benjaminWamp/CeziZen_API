import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateArticleImageDto } from './dto/create-article-image.dto';
import { UpdateArticleImageDto } from './dto/update-article-image.dto';
import { PrismaService } from 'src/prisma.service';
import { join } from 'path';
import * as fs from 'fs';

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
    } catch (error) {
if (error instanceof HttpException) {
      throw error;
    }
      throw new InternalServerErrorException('Erreur lors de la création de l’image');
    }
  }
  async updateArticleImage(articleId: number, newImagePath: string) {
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
        }
      },
      include: { articleImages: true, category: { select: { label: true, id: true } } },
    });
  
    return {
      message: 'Image de l’article mise à jour avec succès',
      data: updatedArticle,
    };
  }

  async removeImage(articleId: number, imageId: number) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      include: { articleImages: { where: { id: imageId } } },
    });
    if (!article) {
      throw new NotFoundException(`Article ${articleId} introuvable`);
    }
    if (!article.articleImages || article.articleImages.length === 0) {
      throw new NotFoundException(`Image ${imageId} non liée à l'article ${articleId}`);
    }

    await this.prisma.article.update({
      where: { id: articleId },
      data: {
        articleImages: {
          disconnect: { id: imageId },
        },
      },
    });

    const image = article.articleImages[0];
    const filename = image.path.split('/').pop();
    const filePath = join(process.cwd(), 'uploads', 'article-images', filename!);
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      if ((err as any).code !== 'ENOENT') {
        throw new InternalServerErrorException(`Erreur suppression fichier ${filename}`);
      }
    }

    await this.prisma.articleImage.delete({ where: { id: imageId } });

    return { message: `Image ${imageId} supprimée de l'article ${articleId}` };
  }

}
