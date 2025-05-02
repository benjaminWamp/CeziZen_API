/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateCitizenDto,
  CreateCitizenwithClerkDTo,
} from './dto/create-citizen.dto';
import {
  UpdateCitizenCredentialsDto,
  UpdateCitizenDto,
} from './dto/update-citizen.dto';
import { PrismaService } from 'src/prisma.service';
import { ClerkService } from 'src/auth/clerk.service';
import { User } from '@clerk/clerk-sdk-node';

@Injectable()
export class CitizenService {
  constructor(
    private prisma: PrismaService,
    private clerkService: ClerkService,
  ) {}

  async create(createCitizenDto: CreateCitizenDto) {
    try {
      let clerkUser: User | undefined;

      clerkUser = await this.clerkService.getClerkUser(createCitizenDto);

      if (!clerkUser) {
        clerkUser = await this.clerkService.createClerkUser(createCitizenDto);
      }

      const defaultRoleId = await this.prisma.role.findUnique({
        where: { name: 'USER' },
        select: {
          id: true,
        },
      });

      const newUser = {
        name: clerkUser.firstName || '',
        surname: clerkUser.lastName || '',
        email: clerkUser.emailAddresses[0].emailAddress,
        roleId: createCitizenDto.roleId || defaultRoleId?.id || 'null',
        clerkId: clerkUser.id,
      };

      const citizen = await this.prisma.citizen.create({
        data: newUser,
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
          role: {
            select: { id: true, name: true },
          },
        },
      });

      if (!citizen) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création du citoyen`,
        );
      }

      return { data: citizen, message: 'Citoyen créé avec succès' };
    } catch (error) {
      console.error(error);
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

  async createWithClerk(createCitizenDto: CreateCitizenwithClerkDTo) {
    try {
      const clerkUser = await this.clerkService.getClerkUser(createCitizenDto);

      if (!clerkUser) {
        throw new NotFoundException(
          "Utilisateur introuvable, vérifié l'inscription sur Clerk",
        );
      }

      const defaultRoleId = await this.prisma.role.findUnique({
        where: { name: 'USER' },
        select: {
          id: true,
        },
      });

      const newUser = {
        name: clerkUser.firstName || '',
        surname: clerkUser.lastName || '',
        email: clerkUser.emailAddresses[0].emailAddress,
        roleId: defaultRoleId?.id || 'null',
        clerkId: clerkUser.id,
      };

      const citizen = await this.prisma.citizen.create({
        data: newUser,
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
          role: {
            select: { id: true, name: true },
          },
        },
      });

      if (!citizen) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création du citoyen`,
        );
      }

      return { data: citizen, message: 'Citoyen créé avec succès' };
    } catch (error) {
      console.error(error);
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

      const citizens = await this.prisma.citizen.findMany({
        skip,
        take,
        orderBy: {
          [orderBy]: sortBy,
        },
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
          role: {
            select: { id: true, name: true },
          },
          clerkId: true,
        },
      });

      if (!citizens || citizens.length === 0) {
        throw new NotFoundException('Aucun citoyen trouvé');
      }
      const totalCitizens = await this.prisma.citizen.count();

      return {
        data: citizens,
        total: totalCitizens,
        page,
        pageSize,
        message: 'Citoyens récupérés avec succès',
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
      const citizen = await this.prisma.citizen.findUnique({
        where: { id: id },
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
          role: {
            select: { id: true, name: true },
          },
        },
      });

      if (!citizen) {
        throw new NotFoundException('Citoyen non trouvé');
      }

      return { data: citizen, message: 'Citoyen récupéré avec succès' };
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

  async findOneFromClerk(clerkId: string) {
    try {
      const citizen = await this.prisma.citizen.findUnique({
        where: { clerkId: clerkId },
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
          role: {
            select: { id: true, name: true },
          },
        },
      });

      if (!citizen) {
        throw new NotFoundException('Citoyen non trouvé');
      }

      return { data: citizen, message: 'Citoyen récupéré avec succès' };
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

  async update(id: string, updateCitizenDto: UpdateCitizenDto) {
    try {
      const citizenData = updateCitizenDto;

      await this.clerkService.updateClerkUser(
        citizenData.clerkId,
        updateCitizenDto,
      );

      const citizen = await this.prisma.citizen.update({
        data: citizenData,
        where: { id: id },
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
          role: {
            select: { id: true, name: true },
          },
        },
      });

      if (!citizen) {
        throw new NotFoundException('Citoyen non trouvé pour la mise à jour');
      }

      return { data: citizen, message: 'Citoyen mis à jour avec succès' };
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

  async updateCredentials(updateCitizenDto: UpdateCitizenCredentialsDto) {
    try {
      const citizenData = updateCitizenDto;

      await this.clerkService.updateClerkUserCredentials(
        citizenData.clerkId,
        updateCitizenDto,
      );

      return { message: 'Mot de passe mis à jour avec succès' };
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
      const citizen = await this.prisma.citizen.findUnique({
        where: { id: id },
      });
      if (!citizen) {
        throw new NotFoundException('Citoyen non trouvé');
      }

      await this.clerkService.deleteClerkUser(citizen.clerkId);

      await this.prisma.citizen.delete({ where: { id: id } });

      return { message: 'Citoyen supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer ce citoyen : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du citoyen',
      );
    }
  }
}
