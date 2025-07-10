import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseService } from './exercise.service';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let prisma: Partial<Record<keyof PrismaService, any>>;

  beforeEach(async () => {
    prisma = {
      exercise: {
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
        ExerciseService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ExerciseService);
  });

  describe('create()', () => {
    const dto: CreateExerciseDto = {
      label: 'Respire',
      times: '5',
      description: 'Test',
      inspiration: 4,
      expiration: 6,
      apnea: 0,
    };

    it('devrait créer un exercice avec succès', async () => {
      const mock = { id: 1, ...dto };
      (prisma.exercise.create as jest.Mock).mockResolvedValue(mock);

      const result = await service.create(dto);

      expect(prisma.exercise.create).toHaveBeenCalledWith({
        data: dto,
        select: {
          id: true,
          label: true,
          times: true,
          description: true,
          inspiration: true,
          expiration: true,
          apnea: true,
        },
      });
      expect(result).toEqual({
        data: mock,
        message: 'Exercice créé avec succès',
      });
    });

    it('devrait lever BadRequestException sur duplication (P2002)', async () => {
      (prisma.exercise.create as jest.Mock).mockRejectedValue({
        code: 'P2002',
      });
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('devrait lever InternalServerErrorException sur erreur inconnue', async () => {
      (prisma.exercise.create as jest.Mock).mockRejectedValue(new Error());
      await expect(service.create(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll()', () => {
    it('devrait renvoyer la liste des exercices', async () => {
      const list = [{ id: 1 }, { id: 2 }];
      (prisma.exercise.findMany as jest.Mock).mockResolvedValue(list);
      (prisma.exercise.count as jest.Mock).mockResolvedValue(2);

      const result = await service.findAll();

      expect(prisma.exercise.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          label: true,
          times: true,
          description: true,
          inspiration: true,
          expiration: true,
          apnea: true,
        },
      });
      expect(prisma.exercise.count).toHaveBeenCalled();
      expect(result).toEqual({
        data: list,
        total: 2,
        message: 'Exercices récupérés avec succès',
      });
    });

    it('devrait lever NotFoundException si aucun exercice', async () => {
      (prisma.exercise.findMany as jest.Mock).mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });

    it('devrait lever InternalServerErrorException sur autre erreur', async () => {
      (prisma.exercise.findMany as jest.Mock).mockRejectedValue(new Error());
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne()', () => {
    it('devrait renvoyer un exercice existant', async () => {
      const mock = { id: 3 };
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue(mock);

      const result = await service.findOne(3);

      expect(prisma.exercise.findUnique).toHaveBeenCalledWith({
        where: { id: 3 },
        select: {
          id: true,
          label: true,
          times: true,
          description: true,
          inspiration: true,
          expiration: true,
          apnea: true,
        },
      });
      expect(result).toEqual({
        data: mock,
        message: 'Exercice récupéré avec succès',
      });
    });

    it('devrait lever NotFoundException si introuvable', async () => {
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('devrait lever InternalServerErrorException sur autre erreur', async () => {
      (prisma.exercise.findUnique as jest.Mock).mockRejectedValue(new Error());
      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update()', () => {
    const dto: UpdateExerciseDto = {
      label: 'Modifié',
    };

    it('devrait mettre à jour un exercice', async () => {
      const mock = { id: 4, label: 'Modifié' };
      (prisma.exercise.update as jest.Mock).mockResolvedValue(mock);

      const result = await service.update(4, dto);

      expect(prisma.exercise.update).toHaveBeenCalledWith({
        data: dto,
        where: { id: 4 },
        select: {
          id: true,
          label: true,
          times: true,
          description: true,
          inspiration: true,
          expiration: true,
          apnea: true,
        },
      });
      expect(result).toEqual({
        data: mock,
        message: 'Exercice mis à jour avec succès',
      });
    });

    it('devrait lever NotFoundException si introuvable', async () => {
      (prisma.exercise.update as jest.Mock).mockResolvedValue(null);
      await expect(service.update(5, dto)).rejects.toThrow(NotFoundException);
    });

    it('devrait lever BadRequestException sur duplication', async () => {
      (prisma.exercise.update as jest.Mock).mockRejectedValue({
        code: 'P2002',
      });
      await expect(service.update(6, dto)).rejects.toThrow(BadRequestException);
    });

    it('devrait lever InternalServerErrorException sur autre erreur', async () => {
      (prisma.exercise.update as jest.Mock).mockRejectedValue(new Error());
      await expect(service.update(7, dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove()', () => {
    it('devrait supprimer un exercice existant', async () => {
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue({ id: 8 });
      (prisma.exercise.delete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.remove(8);
      expect(prisma.exercise.findUnique).toHaveBeenCalledWith({
        where: { id: 8 },
      });
      expect(prisma.exercise.delete).toHaveBeenCalledWith({
        where: { id: 8 },
      });
      expect(result).toEqual({ message: 'Exercice supprimé avec succès' });
    });

    it('devrait lever NotFoundException si introuvable', async () => {
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.remove(9)).rejects.toThrow(NotFoundException);
    });

    it('devrait lever ForbiddenException sur contrainte P2003', async () => {
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue({ id: 9 });
      (prisma.exercise.delete as jest.Mock).mockRejectedValue({
        code: 'P2003',
      });
      await expect(service.remove(9)).rejects.toThrow(ForbiddenException);
    });

    it('devrait lever InternalServerErrorException sur autre erreur', async () => {
      (prisma.exercise.findUnique as jest.Mock).mockImplementation(() => {
        throw new Error();
      });
      await expect(service.remove(10)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
