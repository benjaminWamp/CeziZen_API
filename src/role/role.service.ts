import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}
  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = await this.prisma.role.create({
        data: createRoleDto,
        select: {
          name: true,
        },
      });

      if (!role) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création du rôle`,
        );
      }

      return { data: role, message: 'Rôle créé avec succès' };
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
      const role = await this.prisma.role.findMany({
        select: {
          name: true,
        },
      });

      if (!role || role.length === 0) {
        throw new NotFoundException('Aucun rôle trouvé');
      }
      const totalRoles = await this.prisma.role.count();

      return {
        data: role,
        total: totalRoles,
        message: 'Rôles récupérés avec succès',
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
      const role = await this.prisma.role.findUnique({
        where: { id: id },
        select: {
          name: true,
        },
      });

      if (!role) {
        throw new NotFoundException('Rôle non trouvé');
      }

      return { data: role, message: 'Rôle récupéré avec succès' };
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

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.prisma.role.update({
        data: updateRoleDto,
        where: { id: id },
        select: {
          name: true,
        },
      });

      if (!role) {
        throw new NotFoundException('Rôle non trouvé pour la mise à jour');
      }

      return { data: role, message: 'Rôle mis à jour avec succès' };
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
      const role = await this.prisma.role.findUnique({
        where: { id: id },
      });
      if (!role) {
        throw new NotFoundException('Rôle non trouvé');
      }

      await this.prisma.role.delete({ where: { id: id } });
      return { message: 'Rôle supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer ce rôle : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du commentaire',
      );
    }
  }
}
