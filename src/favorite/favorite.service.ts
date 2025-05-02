import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async getFavoritesFromCitizen(citizenId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { citizenId: citizenId },
      select: {
        id: true,
        citizenId: true,
        ressource: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!citizenId) {
      throw new NotFoundException(`Citoyen introuvable`);
    }

    // Retourne la liste des favoris pour ce client
    return { data: favorites, message: 'Favoris récupéré avec succès.' };
  }

  async createFavorite(createFavoriteDto: CreateFavoriteDto) {
    const { citizenId, ressourceId } = createFavoriteDto;

    const ressource = await this.prisma.ressource.findUnique({
      where: { id: ressourceId },
    });

    if (!ressource) {
      throw new NotFoundException(`Ressource introuvable`);
    }

    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        citizenId_ressourceId: {
          citizenId: citizenId,
          ressourceId: ressourceId,
        },
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Ce favori existe déjà.');
    }

    // Créer le favori en connectant le citizen et la resource
    return await this.prisma.favorite.create({
      data: createFavoriteDto,
      select: {
        id: true,
        citizenId: true,
        ressourceId: true,
      },
    });
  }

  async removeFavorite(favoriteId: string) {
    try {
      await this.prisma.favorite.delete({
        where: { id: favoriteId },
      });
      return { message: 'Favoris supprimé avec succès' };
    } catch (error) {
      throw new NotFoundException('Favori non trouvé.');
    }
  }
}
