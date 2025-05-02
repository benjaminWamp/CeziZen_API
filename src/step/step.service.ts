import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StepService {
  constructor(private prisma: PrismaService) {}

  async create(createStepDto: CreateStepDto) {
    try {
      const step = await this.prisma.step.create({
        data: createStepDto,
        select: {
          id: true,
          title: true,
          description: true,
          order: true,
          ressourceId: true,
        },
      });

      if (!step) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création de l'étape`,
        );
      }

      return { data: step, message: 'Etape créé avec succès' };
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

  async createMany(createStepsDto: CreateStepDto[]) {
    try {
      const result = await this.prisma.step.createMany({
        data: createStepsDto,
        skipDuplicates: true,
      });

      if (result.count === 0) {
        throw new InternalServerErrorException(`Aucune étape n'a été créée.`);
      }

      return {
        data: result,
        message: `${result.count} étape(s) crée(s) avec succès`,
      };
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

  async findAll() {
    try {
      const steps = await this.prisma.step.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          order: true,
          ressourceId: true,
        },
      });

      if (!steps || steps.length === 0) {
        throw new NotFoundException('Aucune étape trouvée');
      }

      return {
        data: steps,
        message: 'Etapes récupérés avec succès',
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

  async findAllFromRessource(ressourceId: string) {
    try {
      const steps = await this.prisma.step.findMany({
        where: { ressourceId },
        select: {
          id: true,
          title: true,
          description: true,
          order: true,
          ressourceId: true,
        },
      });

      if (!steps || steps.length === 0) {
        throw new NotFoundException('Aucune étape trouvée');
      }

      return {
        data: steps,
        message: 'Etapes récupérés avec succès',
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
      const step = await this.prisma.step.findUnique({
        where: { id: id },
        select: {
          id: true,
          title: true,
          description: true,
          order: true,
          ressourceId: true,
        },
      });

      if (!step) {
        throw new NotFoundException('Etape non trouvé');
      }

      return { data: step, message: 'Etape récupéré avec succès' };
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

  async update(id: string, updateStepDto: UpdateStepDto) {
    try {
      const step = await this.prisma.step.update({
        data: updateStepDto,
        where: { id: id },
        select: {
          id: true,
          title: true,
          description: true,
          order: true,
          ressourceId: true,
        },
      });

      if (!step) {
        throw new NotFoundException('Etape non trouvée pour la mise à jour');
      }

      return { data: step, message: 'Etape mise à jour avec succès' };
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

  async updateMultiple(updateStepDto: UpdateStepDto[]) {
    try {
      // Utilisation de Promise.all pour exécuter plusieurs mises à jour en parallèle
      const updatePromises = updateStepDto.map((stepDto) =>
        this.prisma.step.update({
          where: {
            id: stepDto.id, // Identifiant unique de l'étape à mettre à jour
          },
          data: {
            title: stepDto.title,
            description: stepDto.description,
            order: stepDto.order,
          },
        }),
      );

      const updatedSteps = await Promise.all(updatePromises);

      return {
        data: updatedSteps,
        message: `${updatedSteps.length} Étapes mises à jour avec succès`,
      };
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
      const step = await this.prisma.step.findUnique({
        where: { id: id },
      });

      if (!step) {
        throw new NotFoundException('Etape non trouvé');
      }

      await this.prisma.step.delete({ where: { id: id } });
      return { message: 'Etape supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer cette étape : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        "Une erreur inconnue est survenue lors de la suppression de l'étape",
      );
    }
  }
}
