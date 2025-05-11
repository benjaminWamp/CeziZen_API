  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserwithClerkDTo,
} from './dto/create-user.dto';
import {
  UpdateUserCredentialsDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { ClerkService } from 'src/auth/clerk.service';
import { User } from '@clerk/clerk-sdk-node';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private clerkService: ClerkService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      let clerkUser: User | undefined;

      clerkUser = await this.clerkService.getClerkUser(createUserDto);

      if (!clerkUser) {
        clerkUser = await this.clerkService.createClerkUser(createUserDto);
      }

      const defaultRoleId = await this.prisma.role.findUnique({
        where: { name: 'USER' },
        select: {
          id: true,
        },
      });

      const newUser = {
        firstname: clerkUser.firstName || '',
        lastname: clerkUser.lastName || '',
        email: clerkUser.emailAddresses[0].emailAddress,
        roleId: createUserDto.roleId ? Number(createUserDto.roleId) : defaultRoleId?.id!,
        clerkId: clerkUser.id,
      };

      const user = await this.prisma.user.create({
        data: newUser,
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          role: {
            select: { id: true, name: true },
          },
        },
      });

      if (!user) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création du utilisateur`,
        );
      }

      return { data: user, message: 'Utilisateur créé avec succès' };
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

  async createWithClerk(createUserDto: CreateUserwithClerkDTo) {
    try {
      const clerkUser = await this.clerkService.getClerkUser(createUserDto);

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
        firstname: clerkUser.firstName || '',
        lastname: clerkUser.lastName || '',
        email: clerkUser.emailAddresses[0].emailAddress,
        roleId: defaultRoleId?.id!,
        clerkId: clerkUser.id,
      };

      const user = await this.prisma.user.create({
        data: newUser,
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          role: {
            select: { id: true, name: true },
          },
        },
      });

      if (!user) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création du utilisateur`,
        );
      }

      return { data: user, message: 'Utilisateur créé avec succès' };
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
    if (page <= 0 || pageSize <= 0) {
      throw new BadRequestException(
        'Les paramètres page et pageSize doivent être supérieurs à 0',
      );
    }
    try {

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

      const users = await this.prisma.user.findMany({
        skip,
        take,
        orderBy: {
          [orderBy]: sortBy,
        },
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          role: {
            select: { id: true, name: true },
          },
          clerkId: true,
        },
      });

      if (!users || users.length === 0) {
        throw new NotFoundException('Aucun utilisateur trouvé');
      }
      const totalUsers = await this.prisma.user.count();

      return {
        data: users,
        total: totalUsers,
        page,
        pageSize,
        message: 'Utilisateurs récupérés avec succès',
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
      const user = await this.prisma.user.findUnique({
        where: { id: id },
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          role: {
            select: { id: true, name: true },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      return { data: user, message: 'Utilisateur récupéré avec succès' };
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
      const user = await this.prisma.user.findUnique({
        where: { clerkId: clerkId },
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          role: {
            select: { id: true, name: true },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      return { data: user, message: 'Utilisateur récupéré avec succès' };
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const userData = updateUserDto;

      await this.clerkService.updateClerkUser(
        userData.clerkId,
        updateUserDto,
      );

      const user = await this.prisma.user.update({
        data: userData,
        where: { id: id },
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          role: {
            select: { id: true, name: true },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé pour la mise à jour');
      }

      return { data: user, message: 'Utilisateur mis à jour avec succès' };
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

  async updateCredentials(updateUserDto: UpdateUserCredentialsDto) {
    try {
      const userData = updateUserDto;

      await this.clerkService.updateClerkUserCredentials(
        userData.clerkId,
        updateUserDto,
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

  async remove(id: number) {
    try {
      await this.prisma.article.deleteMany({ where: { userId: id } });
    await this.prisma.exerciseSession.deleteMany({ where: { userId: id } });
      const user = await this.prisma.user.findUnique({
        where: { id: id },
      });
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      await this.clerkService.deleteClerkUser(user.clerkId);

      await this.prisma.user.delete({ where: { id: id } });

      return { message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer cet utilisateur : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du utilisateur',
      );
    }
  }
}
