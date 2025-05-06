/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArticleService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    try {
      const {  ...ressourceData } =
        createArticleDto;

      const article = await this.prisma.article.create({
        data: {
          ...ressourceData,
          userId: ressourceData.userId,
        },
        select: {
          id: true,
        },
      });

      const ressourceFinal = await this.prisma.article.findUnique({
        where: { id: article.id },
        select: {
          id: true,
          label: true,
          description: true,
          content: true,
          category: {
            select: { label: true, id: true },
          },
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      });

      return { data: ressourceFinal, message: 'Articles créé avec succès' };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Une erreur de validation est survenue (données dupliquées)',
        );
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async findAll(
    page: number = 1,
    pageSize: number = 50,
    orderBy: string = 'createdAt',
    sortBy: string = 'desc',
  ) {
    try {
      if (page <= 0 || pageSize <= 0) {
        throw new BadRequestException(
          'Les paramètres page et pageSize doivent être supérieurs à 0',
        );
      }

      if (sortBy !== 'asc' && sortBy !== 'desc') {
        throw new BadRequestException(
          'Le paramètre "sort" doit être "asc" ou "desc"',
        );
      }

      if (pageSize > 100) {
        throw new BadRequestException('Nombre de retour maximum dépassé');
      }

      const validOrderByFields = [
        'email',
        'name',
        'surname',
        'createdAt',
        'updatedAt',
      ];

      if (!validOrderByFields.includes(orderBy)) {
        throw new BadRequestException('Le paramètre "orderBy" est invalide.');
      }

      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const Articles = await this.prisma.article.findMany({
        skip,
        take,
        orderBy: {
          [orderBy]: sortBy,
        },
        select: {
          id: true,
          label: true,
          description: true,
          content: true,
          category: {
            select: { id: true, label: true },
          },
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      });

      if (!Articles || Articles.length === 0) {
        throw new NotFoundException('Aucune Articles trouvé');
      }
      const totalArticles = await this.prisma.article.count();

      return {
        data: Articles,
        total: totalArticles,
        page,
        pageSize,
        message: 'Articles récupérés avec succès',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async findOne(id: number) {
    try {
      const Article = await this.prisma.article.findUnique({
        where: { id: id },
        select: {
          id: true,
          label: true,
          description: true,
          content: true,
          category: {
            select: { id: true, label: true },
          },
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      });

      if (!Article) {
        throw new NotFoundException('Articles non trouvé');
      }

      return { data: Article, message: 'Articles récupéré avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async findUserArticle(userId: number) {
    try {
      const Article = await this.prisma.article.findMany({
        where: { userId },
        select: {
          id: true,
          label: true,
          description: true,
          content: true,
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      });

      if (!Article) {
        throw new NotFoundException('Articles non trouvé');
      }

      return { data: Article, message: 'Articles récupéré avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    try {
      const Article = await this.prisma.article.update({
        data: updateArticleDto,
        where: { id: id },
        select: {
          id: true,
          label: true,
          description: true,
          content: true,
          category: {
            select: { id: true, label: true },
          },
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      });

      if (!Article) {
        throw new NotFoundException('Article non trouvé pour la mise à jour');
      }

      return { data: Article, message: 'Articles mis à jour avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new BadRequestException('Contrainte violée : donnée dupliquée');
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async remove(id: number) {
    try {
      const article = await this.prisma.article.findUnique({
        where: { id: id },
      });
      if (!article) {
        throw new NotFoundException('Articles non trouvé');
      }

      await this.prisma.article.delete({
        where: { id: id },
      });

      return {message: 'Articles supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer cette Articles : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du citoyen',
      );
    }
  }
}
