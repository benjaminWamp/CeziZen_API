import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRessourceTypeDto } from './dto/create-ressource-type.dto';
import { UpdateRessourceTypeDto } from './dto/update-ressource-type.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TypeRessourceService {
  constructor(private readonly prisma: PrismaService) {}
  async createRessourceType(createRessourceType: CreateRessourceTypeDto) {
    try {
      const typeRessourceData = createRessourceType;

      const typeRessource = await this.prisma.typeRessource.create({
        data: typeRessourceData,
        select: {
          name: true,
          id: true,
        },
      });

      if (!typeRessource) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création du citoyen`,
        );
      }

      return {
        data: typeRessource,
        message: 'Type de ressource créé avec succès',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof NotFoundException) {
        throw error;
      }

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

  async updateRessourceType(
    id: string,
    updateRessourceType: UpdateRessourceTypeDto,
  ) {
    try {
      const typeRessourceData = updateRessourceType;

      const typeRessource = await this.prisma.typeRessource.update({
        data: typeRessourceData,
        where: { id: id },
        select: {
          name: true,
          id: true,
        },
      });

      if (!typeRessource) {
        throw new NotFoundException(
          'Type de ressource non trouvé pour la mise à jour',
        );
      }

      return {
        data: typeRessource,
        message: 'Type de ressource mis à jour avec succès',
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

  async findAll() {
    try {
      const typeRessources = await this.prisma.typeRessource.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      if (!typeRessources) {
        throw new NotFoundException('Aucun type de ressource trouvé');
      }

      return {
        data: typeRessources,
        message: 'Type de ressource récupérés avec succès',
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
      const resourceType = await this.prisma.typeRessource.findUnique({
        where: { id },
        select: { id: true, name: true },
      });
      if (!resourceType) {
        throw new NotFoundException(`RessourceType with id ${id} not found`);
      }
      return {
        data: resourceType,
        message: 'Type de ressource récupéré avec succès',
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

  async deleteRessourceType(id: string) {
    try {
      const resourceType = await this.prisma.typeRessource.findUnique({
        where: { id },
      });
      if (!resourceType) {
        throw new NotFoundException(
          `Type de ressource avec l'id ${id} non trouvé`,
        );
      }
      await this.prisma.typeRessource.delete({
        where: { id },
      });
      return { message: 'Type de ressource supprimé avec succès' };
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
}
