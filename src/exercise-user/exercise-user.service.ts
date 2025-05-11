import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateExerciseUserDto } from './dto/create-exercise-user.dto';
import { UpdateExerciseUserDto } from './dto/update-exercise-user.dto';

@Injectable()
export class ExerciseUserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExerciseUserDto) {
    try {
      const session = await this.prisma.exerciseSession.create({
        data: dto,
        include: { user: true, exercise: true },
      });
      return { data: session, message: 'Session créée avec succès' };
    } catch (error) {
      if (error instanceof HttpException) {
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

  async findAll() {
    try {
      const sessions = await this.prisma.exerciseSession.findMany({
        include: { user: true, exercise: true },
      });
      const total = await this.prisma.exerciseSession.count();
      return { data: sessions, total, message: 'Sessions récupérées' };
    } catch (error) {
if (error instanceof HttpException) {
      throw error;
    }
      throw new InternalServerErrorException('Erreur lors de la récupération');
    }
  }

  async findOne(id: number) {
    if (id <= 0) {
    throw new BadRequestException('L\'identifiant doit être supérieur à 0');
  }
    try {
      const session = await this.prisma.exerciseSession.findUnique({
        where: { id },
        include: { user: true, exercise: true },
      });
      if (!session) throw new NotFoundException('Session non trouvée');
      return { data: session, message: 'Session trouvée' };
    } catch (error) {
if (error instanceof HttpException) {
      throw error;
    }
      throw new InternalServerErrorException('Erreur lors de la recherche');
    }
  }

  async update(id: number, dto: UpdateExerciseUserDto) {
    try {
      const session = await this.prisma.exerciseSession.update({
        where: { id },
        data: dto,
        include: { user: true, exercise: true },
      });
      return { data: session, message: 'Session mise à jour' };
    } catch (error) {
if (error instanceof HttpException) {
      throw error;
    }
      throw new InternalServerErrorException('Erreur lors de la mise à jour');
    }
  }

  async remove(id: number) {
    if (id <= 0) {
      throw new BadRequestException('L\'identifiant doit être supérieur à 0');
    }
    try {
      await this.prisma.exerciseSession.delete({ where: { id } });
      return { message: 'Session supprimée avec succès' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException('Contrainte détectée, suppression impossible');
      }
      throw new InternalServerErrorException('Erreur lors de la suppression');
    }
  }
}
