import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProgressionDto } from './dto/update-progression.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateProgressionDto } from './dto/create-progression.dto';
import { ProgressionType } from 'src/utils/types/PrismaApiModel.type';

@Injectable()
export class ProgressionService {
  constructor(private readonly prisma: PrismaService) {}

  async initializeProgression(createProgressionDto: CreateProgressionDto) {
    const { ressourceId, citizenId } = createProgressionDto;
    const initializerProgression: Array<ProgressionType> = [];

    const steps = await this.prisma.step.findMany({
      where: { ressourceId },
    });

    if (steps.length === 0) {
      throw new NotFoundException('Aucune étapes trouvées');
    }

    const isAlreadyInAProgression = await this.prisma.progression.findFirst({
      where: { citizenId },
    });

    if (isAlreadyInAProgression === null) {
      for (const step of steps) {
        const existingProgression = await this.prisma.progression.findFirst({
          where: { citizenId, stepId: step.id, completed: false, ressourceId },
        });

        if (!existingProgression) {
          const progression = await this.prisma.progression.create({
            data: {
              citizenId,
              stepId: step.id,
              completed: false,
              ressourceId: ressourceId,
            },
          });
          initializerProgression.push(progression);
        } else {
          throw new BadRequestException(
            'Une erreur de validation est survenue (données dupliquées)',
          );
        }
      }
      if (initializerProgression.length === 0) {
        throw new InternalServerErrorException(
          "Une erreur est survenue durant l'initilisation de la progression",
        );
      }

      const ressource = await this.prisma.ressource.findUnique({
        where: { id: ressourceId },
        select: {
          id: true,
          maxParticipant: true,
          nbParticipant: true,
        },
      });

      if (!ressource || !ressource.maxParticipant) {
        throw new BadRequestException(
          'Une erreur est survenue dans la récupération de la ressource',
        );
      }

      if (ressource.nbParticipant >= ressource.maxParticipant) {
        throw new BadRequestException('Nombre maximum atteint');
      }

      await this.prisma.ressource.update({
        where: { id: ressourceId },
        data: {
          nbParticipant: {
            increment: 1,
          },
        },
      });

      return {
        data: initializerProgression,
        message: 'Progression initialisé avec succès',
      };
    } else {
      throw new BadRequestException(
        'Ce citoyen est déjà inscris à une ressource',
      );
    }
  }

  async getProgression(citizenId: string) {
    if (!citizenId) {
      throw new BadRequestException('Veuillez renseigner le citizen ');
    }
    try {
      // await this.initializeProgression({
      //   citizenId,
      //   ressourceId,
      // });

      const progression = await this.prisma.progression.findMany({
        where: {
          citizenId,
        },
        include: {
          step: true,
        },
      });

      return {
        data: progression,
        message: 'Progression créé et récupéré avec succès',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Une erreur de validation est survenue (données dupliquées)',
        );
      }
      //------Permet de bien renvoyer les erreurs de initializeProgression si il y en a
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof NotFoundException) {
        throw error;
      }
      //-----------------------//
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async updateProgression(
    id: string,
    updateProgressionDto: UpdateProgressionDto,
  ) {
    const progression = await this.prisma.progression.findUnique({
      where: { id },
    });

    if (!progression) {
      throw new NotFoundException('Progression non trouvé pour la mise à jour');
    }

    try {
      const updatedProgression = await this.prisma.progression.update({
        where: { id },
        data: {
          completed: updateProgressionDto.completed,
          dateCompleted: updateProgressionDto.completed ? new Date() : null,
        },
      });
      if (!updatedProgression) {
        throw new NotFoundException(
          'Progression non trouvé pour la mise à jour',
        );
      }
      return {
        data: updatedProgression,
        message: 'Progression complétée avec succès',
      };
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

  async deleteProgression(citizenId: string) {
    if (!citizenId) {
      throw new BadRequestException('Veuillez renseigner le citizen');
    }

    try {
      const oneProgression = await this.prisma.progression.findFirst({
        where: { citizenId },
        select: { ressourceId: true },
      });

      if (!oneProgression) {
        return {
          data: [],
          message: 'Aucune progression à supprimer',
        };
      }

      const ressource = await this.prisma.ressource.findUnique({
        where: { id: oneProgression.ressourceId },
        select: { nbParticipant: true },
      });

      if (!ressource || !ressource.nbParticipant) {
        throw new NotFoundException('Ressource introuvable');
      }

      if (ressource.nbParticipant <= 0) {
        throw new BadRequestException(
          'Le nombre de participants est déjà à zéro',
        );
      }

      const deleteProgressions = this.prisma.progression.deleteMany({
        where: { citizenId },
      });

      const decrementParticipant = this.prisma.ressource.update({
        where: { id: oneProgression.ressourceId },
        data: {
          nbParticipant: {
            decrement: 1,
          },
        },
      });

      const result = await this.prisma.$transaction([
        deleteProgressions,
        decrementParticipant,
      ]);

      return {
        data: result,
        message: 'Progressions supprimées et nbParticipant mis à jour',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Une erreur de validation est survenue (données dupliquées)',
        );
      }

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  private getCurrentUTCDate(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  async deleteProgressionForExpiredRessources() {
    const todayUTC = this.getCurrentUTCDate(); // Date du jour en UTC sans l'heure

    console.log(
      'Checking for expired ressources with deadline before:',
      todayUTC,
    );

    const expiredRessources = await this.prisma.ressource.findMany({
      where: { deadLine: { lte: todayUTC } },
      select: { id: true },
    });

    const ressourceIds = expiredRessources.map((r) => r.id);

    console.log(
      `Found ${ressourceIds.length} expired ressources to delete progressions for.`,
    );

    if (ressourceIds.length > 0) {
      await this.prisma.progression.deleteMany({
        where: {
          step: { ressourceId: { in: ressourceIds } },
        },
      });
      console.log(`Deleted progressions for expired ressources.`);
    } else {
      console.log('No expired ressources found.');
    }
  }

  async hasProgression(
    citizenId: string,
    resourceId: string,
  ): Promise<boolean> {
    const progression = await this.prisma.progression.findFirst({
      where: {
        citizenId,
        ressourceId: resourceId,
      },
    });

    return !!progression;
  }
}
