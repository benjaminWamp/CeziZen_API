import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma.service';
import { RessourceService } from 'src/Ressource/Ressource.service';
import { ProgressionService } from 'src/progression/progression.service';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private ressourceService: RessourceService,
    private progressionService: ProgressionService,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    try {
      const isInProgress = await this.ressourceService.isRessourceInProgress(
        createMessageDto.ressourceId,
      );

      if (!isInProgress) {
        throw new ForbiddenException(
          "La ressource n'est pas en cours, la messagerie n'est pas possible.",
        );
      }

      const hasProgression = await this.progressionService.hasProgression(
        createMessageDto.citizenId,
        createMessageDto.ressourceId,
      );
      if (!hasProgression) {
        throw new ForbiddenException(
          "Vous n'êtes pas inscrit à cette ressource. La messagerie est réservée aux inscrits.",
        );
      }

      const Message = await this.prisma.message.create({
        data: createMessageDto,
        select: {
          id: true,
          message: true,
          updatedAt: true,
          ressourceId: true,
          citizen: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!Message) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création du Message`,
        );
      }

      return { data: Message, message: 'Message créé avec succès' };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
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
      const Messages = await this.prisma.message.findMany({
        where: { citizenId: citizenId },
        select: {
          id: true,
          message: true,
          updatedAt: true,
          ressourceId: true,
          citizen: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!Messages || Messages.length === 0) {
        throw new NotFoundException('Aucun Message trouvé');
      }
      const totalMessages = await this.prisma.message.count();

      return {
        data: Messages,
        total: totalMessages,
        message: 'Messages récupérés avec succès',
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
      const Message = await this.prisma.message.findUnique({
        where: { id: id },
        select: {
          id: true,
          message: true,
          updatedAt: true,
          ressourceId: true,
          citizen: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!Message) {
        throw new NotFoundException('Message non trouvé');
      }

      return { data: Message, message: 'Message récupéré avec succès' };
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

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    try {
      const Message = await this.prisma.message.update({
        data: updateMessageDto,
        where: { id: id },
        select: {
          id: true,
          message: true,
          updatedAt: true,
          ressourceId: true,
          citizen: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!Message) {
        throw new NotFoundException('Message non trouvé pour la mise à jour');
      }

      return { data: Message, message: 'Message mis à jour avec succès' };
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
      const Message = await this.prisma.message.findUnique({
        where: { id: id },
      });
      if (!Message) {
        throw new NotFoundException('Message non trouvé');
      }

      await this.prisma.message.delete({ where: { id: id } });
      return { message: 'Message supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer ce Message : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du Message',
      );
    }
  }
}
