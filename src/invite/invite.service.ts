import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateInviteDto } from './dto/create-invite.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InviteService {
  constructor(private prisma: PrismaService) {}
  async create(createInviteDto: CreateInviteDto) {
    try {
      const userToInvite = await this.prisma.citizen.findUnique({
        where: { email: createInviteDto.receverEmail },
        select: { id: true },
      });
      if (!userToInvite) {
        throw new NotFoundException(`Ciotyen introuvable`);
      }

      const inviteData = {
        senderId: createInviteDto.senderId,
        ressourceId: createInviteDto.ressourceId,
        receverId: userToInvite.id,
      };

      const invite = await this.prisma.invite.create({
        data: inviteData,
        select: {
          id: true,
          updatedAt: true,
          accept: true,
          ressource: { select: { id: true, title: true } },
          sender: {
            select: {
              name: true,
              surname: true,
            },
          },
          recever: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!invite) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création du invite`,
        );
      }

      return { data: invite, message: 'Invitation envoyé avec succès' };
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

  async acceptInvite(id: string) {
    try {
      const invite = await this.prisma.invite.update({
        data: { accept: true },
        where: { id: id },
        select: {
          id: true,
          accept: true,
          createdAt: true,
          ressourceId: true,
          sender: {
            select: {
              name: true,
              surname: true,
            },
          },
          recever: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!invite) {
        throw new NotFoundException(
          'Invitation non trouvé pour la mise à jour',
        );
      }

      return { data: invite, message: 'Invitation accepté avec succès' };
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

  async findOne(id: string) {
    try {
      const invite = await this.prisma.invite.findUnique({
        where: { id: id },
        select: {
          id: true,
          accept: true,
          createdAt: true,
          ressource: { select: { id: true, title: true } },
          sender: {
            select: {
              name: true,
              surname: true,
            },
          },
          recever: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!invite) {
        throw new NotFoundException('Invite non trouvé');
      }

      return { data: invite, message: 'Invite récupéré avec succès' };
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

  async findReceverInvite(receverId: string) {
    try {
      const invite = await this.prisma.invite.findMany({
        where: { receverId },
        select: {
          id: true,
          accept: true,
          createdAt: true,
          ressource: { select: { id: true, title: true } },
          sender: {
            select: {
              name: true,
              surname: true,
            },
          },
          recever: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!invite) {
        throw new NotFoundException('Invite non trouvé');
      }

      return { data: invite, message: 'Invite récupéré avec succès' };
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

  async findSenderInvite(senderId: string) {
    try {
      const invite = await this.prisma.invite.findMany({
        where: { senderId },
        select: {
          id: true,
          accept: true,
          createdAt: true,
          ressource: { select: { id: true, title: true } },
          sender: {
            select: {
              name: true,
              surname: true,
            },
          },
          recever: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!invite) {
        throw new NotFoundException('Invite non trouvé');
      }

      return { data: invite, message: 'Invite récupéré avec succès' };
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

  async findCitizenInvites(citizenId: string) {
    try {
      const invite = await this.prisma.invite.findMany({
        where: { OR: [{ senderId: citizenId }, { receverId: citizenId }] },
        select: {
          id: true,
          accept: true,
          createdAt: true,
          ressource: { select: { id: true, title: true } },
          sender: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
          recever: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!invite) {
        throw new NotFoundException('Invite non trouvé');
      }

      return { data: invite, message: 'Invite récupéré avec succès' };
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

  async remove(id: string) {
    try {
      const Invite = await this.prisma.invite.findUnique({
        where: { id: id },
      });
      if (!Invite) {
        throw new NotFoundException('Invitation non trouvé');
      }

      await this.prisma.invite.delete({ where: { id: id } });
      return { Invite: 'Invitation refusée avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer ce invitation : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du Invite',
      );
    }
  }

  private getCurrentUTCDate(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  async deleteProgressionForExpiredRessources() {
    const todayUTC = this.getCurrentUTCDate(); // Date du jour en UTC sans l'heure

    const oneWeekAgo = new Date(todayUTC);
    oneWeekAgo.setDate(todayUTC.getDate() - 7);

    console.log(
      'Checking for accepted invite for one week since',
      oneWeekAgo.toISOString(),
    );

    const expiredRessources = await this.prisma.invite.findMany({
      where: {
        accept: true,
        updatedAt: {
          lt: oneWeekAgo,
        },
      },
      select: { id: true },
    });

    const expiredInviteIds = expiredRessources.map((r) => r.id);

    console.log(
      `Found ${expiredInviteIds.length} expired  accepted invite to delete `,
    );

    if (expiredInviteIds.length > 0) {
      await this.prisma.invite.deleteMany({
        where: {
          id: { in: expiredInviteIds },
        },
      });
      console.log(`Deleted ${expiredInviteIds.length} expired invites.`);
    } else {
      console.log('No expired invites found.');
    }
  }
}
