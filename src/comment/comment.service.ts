import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  async create(createCommentDto: CreateCommentDto) {
    try {
      const comment = await this.prisma.comment.create({
        data: createCommentDto,
        select: {
          id: true,
          title: true,
          description: true,
          updatedAt: true,
          ressourceId: true,
          citizen: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!comment) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création du commentaire`,
        );
      }

      return { data: comment, message: 'Commentaire créé avec succès' };
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

  async findAll(citizenId: string | undefined) {
    try {
      const comments = await this.prisma.comment.findMany({
        where: { citizenId: citizenId },
        select: {
          id: true,
          title: true,
          description: true,
          ressourceId: true,
          updatedAt: true,
          citizen: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!comments || comments.length === 0) {
        throw new NotFoundException('Aucun commentaire trouvé');
      }
      const totalComments = await this.prisma.comment.count();

      return {
        data: comments,
        total: totalComments,
        message: 'Commentaires récupérés avec succès',
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
      const comment = await this.prisma.comment.findUnique({
        where: { id: id },
        select: {
          id: true,
          title: true,
          description: true,
          ressourceId: true,
          updatedAt: true,
          citizen: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!comment) {
        throw new NotFoundException('Commentaire non trouvé');
      }

      return { data: comment, message: 'Commentaire récupéré avec succès' };
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

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const comment = await this.prisma.comment.update({
        data: updateCommentDto,
        where: { id: id },
        select: {
          id: true,
          title: true,
          description: true,
          ressourceId: true,
          updatedAt: true,
          citizen: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!comment) {
        throw new NotFoundException(
          'Commentaire non trouvé pour la mise à jour',
        );
      }

      return { data: comment, message: 'Commentaire mis à jour avec succès' };
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
      const comment = await this.prisma.comment.findUnique({
        where: { id: id },
      });
      if (!comment) {
        throw new NotFoundException('Commentaire non trouvé');
      }

      await this.prisma.comment.delete({ where: { id: id } });
      return { message: 'Commentaire supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer ce commentaire : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du commentaire',
      );
    }
  }
}
