import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: createCategoryDto,
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      if (!category) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création du catégorie`,
        );
      }

      return { data: category, message: 'Catégorie créé avec succès' };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
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

  async findAll() {
    try {
      const categories = await this.prisma.category.findMany({
        select: { id: true, name: true, description: true },
      });

      if (!categories || categories.length === 0) {
        throw new NotFoundException('Aucun catégorie trouvé');
      }
      const totalCategories = await this.prisma.category.count();

      return {
        data: categories,
        total: totalCategories,
        message: 'Catégories récupérés avec succès',
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

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: id },
        select: { id: true, name: true, description: true },
      });

      if (!category) {
        throw new NotFoundException('Catégorie non trouvé');
      }

      return { data: category, message: 'Catégorie récupéré avec succès' };
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

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.prisma.category.update({
        data: updateCategoryDto,
        where: { id: id },
        select: { id: true, name: true, description: true },
      });

      if (!category) {
        throw new NotFoundException('Catégorie non trouvé pour la mise à jour');
      }

      return { data: category, message: 'Catégorie mis à jour avec succès' };
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

  async remove(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: id },
      });
      if (!category) {
        throw new NotFoundException('Catégorie non trouvé');
      }

      await this.prisma.category.delete({ where: { id: id } });
      return { message: 'Catégorie supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer ce catégorie : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du catégorie',
      );
    }
  }
}
