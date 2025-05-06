import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ExerciseService {
  constructor(private prisma: PrismaService) {}

  async create(createExerciceDto: CreateExerciseDto) {
    try {      
      const exercise = await this.prisma.exercise.create({
        data: createExerciceDto,
        select: {
          id: true,
          label: true,
          times: true,
          description: true,
          inspiration: true,
          expiration: true,
          apnea: true,
        },
      });

      if (!exercise) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création de l'exercice`,
        );
      }

      return { data: exercise, message: 'Exercice créé avec succès' };
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
      const exercises = await this.prisma.exercise.findMany({
        select: {
          id: true,
          label: true,
          times: true,
          description: true,
          inspiration: true,
          expiration: true,
          apnea: true,
        },
      });

      if (!exercises || exercises.length === 0) {
        throw new NotFoundException('Aucun exercice trouvé');
      }
      const totalExercices = await this.prisma.exercise.count();

      return {
        data: exercises,
        total: totalExercices,
        message: 'Exercices récupérés avec succès',
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
      const exercise = await this.prisma.exercise.findUnique({
        where: { id: id },
        select: {
          id: true,
          label: true,
          times: true,
          description: true,
          inspiration: true,
          expiration: true,
          apnea: true,
        },
      });

      if (!exercise) {
        throw new NotFoundException('Exercice non trouvé');
      }

      return { data: exercise, message: 'Exercice récupéré avec succès' };
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

  async update(id: number, updateExerciceDto: UpdateExerciseDto) {
    try {
      const exercise = await this.prisma.exercise.update({
        data: updateExerciceDto,
        where: { id: id },
        select: {
          id: true,
          label: true,
          times: true,
          description: true,
          inspiration: true,
          expiration: true,
          apnea: true,
        },
      });

      if (!exercise) {
        throw new NotFoundException('Exercice non trouvé pour la mise à jour');
      }

      return { data: exercise, message: 'Exercice mis à jour avec succès' };
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
      const exercise = await this.prisma.exercise.findUnique({
        where: { id: id },
      });
      if (!exercise) {
        throw new NotFoundException('Exercice non trouvé');
      }

      await this.prisma.exercise.delete({ where: { id: id } });
      return { message: 'Exercice supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer cet exercice : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression de l\'exercice',
      );
    }
  }
}
