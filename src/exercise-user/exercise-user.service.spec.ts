import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseUserService } from './exercise-user.service';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateExerciseUserDto } from './dto/create-exercise-user.dto';
import { UpdateExerciseUserDto } from './dto/update-exercise-user.dto';

describe('ExerciseUserService', () => {
  let service: ExerciseUserService;
  let prisma: Partial<Record<keyof PrismaService, any>>;

  beforeEach(async () => {
    prisma = {
      exerciseSession: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseUserService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ExerciseUserService);
  });

  describe('create()', () => {
    const dto: CreateExerciseUserDto = {
      userId: 1,
      exerciseId: 2,
      endDate: new Date().toISOString(),
    };

    it('devrait créer une session avec succès', async () => {
      const mockSession = { id: 10, ...dto, user: {}, exercise: {} };
      (prisma.exerciseSession.create as jest.Mock).mockResolvedValue(mockSession);

      const result = await service.create(dto);
      expect(prisma.exerciseSession.create).toHaveBeenCalledWith({
        data: dto,
        include: { user: true, exercise: true },
      });
      expect(result).toEqual({
        data: mockSession,
        message: 'Session créée avec succès',
      });
    });

    it('devrait lever BadRequestException sur duplication (P2002)', async () => {
      (prisma.exerciseSession.create as jest.Mock).mockRejectedValue({
        code: 'P2002',
      });
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('devrait lever InternalServerErrorException sur autre erreur', async () => {
      (prisma.exerciseSession.create as jest.Mock).mockRejectedValue(
        new Error(),
      );
      await expect(service.create(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll()', () => {
    it('devrait retourner toutes les sessions et le total', async () => {
      const sessions = [{ id: 1 }, { id: 2 }];
      (prisma.exerciseSession.findMany as jest.Mock).mockResolvedValue(
        sessions,
      );
      (prisma.exerciseSession.count as jest.Mock).mockResolvedValue(2);

      const result = await service.findAll();
      expect(prisma.exerciseSession.findMany).toHaveBeenCalledWith({
        include: { user: true, exercise: true },
      });
      expect(prisma.exerciseSession.count).toHaveBeenCalled();
      expect(result).toEqual({
        data: sessions,
        total: 2,
        message: 'Sessions récupérées',
      });
    });

    it('devrait lever InternalServerErrorException sur erreur', async () => {
      (prisma.exerciseSession.findMany as jest.Mock).mockRejectedValue(
        new Error(),
      );
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne()', () => {
    it('devrait retourner une session existante', async () => {
      const session = { id: 5, user: {}, exercise: {} };
      (prisma.exerciseSession.findUnique as jest.Mock).mockResolvedValue(
        session,
      );

      const result = await service.findOne(5);
      expect(prisma.exerciseSession.findUnique).toHaveBeenCalledWith({
        where: { id: 5 },
        include: { user: true, exercise: true },
      });
      expect(result).toEqual({ data: session, message: 'Session trouvée' });
    });

    it('devrait lever NotFoundException si introuvable', async () => {
      (prisma.exerciseSession.findUnique as jest.Mock).mockResolvedValue(
        null,
      );
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('devrait lever InternalServerErrorException sur erreur', async () => {
      (prisma.exerciseSession.findUnique as jest.Mock).mockRejectedValue(
        new Error(),
      );
      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update()', () => {
    const dto: UpdateExerciseUserDto = { endDate: new Date().toISOString() };

    it('devrait mettre à jour une session', async () => {
      const updated = { id: 7, ...dto, user: {}, exercise: {} };
      (prisma.exerciseSession.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update(7, dto);
      expect(prisma.exerciseSession.update).toHaveBeenCalledWith({
        where: { id: 7 },
        data: dto,
        include: { user: true, exercise: true },
      });
      expect(result).toEqual({ data: updated, message: 'Session mise à jour' });
    });

    it('devrait lever InternalServerErrorException sur erreur', async () => {
      (prisma.exerciseSession.update as jest.Mock).mockRejectedValue(
        new Error(),
      );
      await expect(service.update(7, dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove()', () => {
    it('devrait supprimer une session existante', async () => {
      (prisma.exerciseSession.delete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.remove(8);
      expect(prisma.exerciseSession.delete).toHaveBeenCalledWith({
        where: { id: 8 },
      });
      expect(result).toEqual({ message: 'Session supprimée avec succès' });
    });

    it('devrait lever ForbiddenException pour code P2003', async () => {
      (prisma.exerciseSession.delete as jest.Mock).mockRejectedValue({
        code: 'P2003',
      });
      await expect(service.remove(9)).rejects.toThrow(ForbiddenException);
    });

    it('devrait lever InternalServerErrorException sur autre erreur', async () => {
      (prisma.exerciseSession.delete as jest.Mock).mockRejectedValue(
        new Error(),
      );
      await expect(service.remove(10)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
