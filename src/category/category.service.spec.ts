import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: Partial<Record<keyof PrismaService, any>>;

  beforeEach(async () => {
    prisma = {
      category: {
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
        CategoryService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(CategoryService);
  });

  describe('create()', () => {
    it('devrait créer une catégorie et renvoyer le bon format', async () => {
      const dto = { label: 'Nouvelle' };
      const mockCat = { id: 1, label: 'Nouvelle' };
      (prisma.category.create as jest.Mock).mockResolvedValue(mockCat);

      const result = await service.create(dto as any);

      expect(prisma.category.create).toHaveBeenCalledWith({
        data: dto,
        select: { id: true, label: true },
      });
      expect(result).toEqual({
        data: mockCat,
        message: 'Catégorie créé avec succès',
      });
    });

    it('devrait lever BadRequestException sur duplication (P2002)', async () => {
      (prisma.category.create as jest.Mock).mockRejectedValue({
        code: 'P2002',
      });
      await expect(service.create({ label: 'dup' } as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('devrait lever InternalServerErrorException sur erreur inconnue', async () => {
      (prisma.category.create as jest.Mock).mockRejectedValue(new Error('x'));
      await expect(service.create({ label: 'x' } as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll()', () => {
    it('devrait renvoyer la liste paginée', async () => {
      const mockCats = [
        { id: 1, label: 'A' },
        { id: 2, label: 'B' },
      ];
      (prisma.category.findMany as jest.Mock).mockResolvedValue(mockCats);
      (prisma.category.count as jest.Mock).mockResolvedValue(2);

      const result = await service.findAll();

      expect(prisma.category.findMany).toHaveBeenCalledWith({
        select: { id: true, label: true },
      });
      expect(prisma.category.count).toHaveBeenCalled();
      expect(result).toEqual({
        data: mockCats,
        total: 2,
        message: 'Catégories récupérés avec succès',
      });
    });

    it('devrait lever NotFoundException si aucune catégorie', async () => {
      (prisma.category.findMany as jest.Mock).mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });

    it('devrait lever InternalServerErrorException sur erreur inconnue', async () => {
      (prisma.category.findMany as jest.Mock).mockRejectedValue(new Error());
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne()', () => {
    it('devrait renvoyer une catégorie existante', async () => {
      const mockCat = { id: 3, label: 'C' };
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCat);

      const result = await service.findOne(3);

      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: 3 },
        select: { id: true, label: true },
      });
      expect(result).toEqual({
        data: mockCat,
        message: 'Catégorie récupéré avec succès',
      });
    });

    it('devrait lever NotFoundException si introuvable', async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('devrait lever InternalServerErrorException sur erreur inconnue', async () => {
      (prisma.category.findUnique as jest.Mock).mockRejectedValue(new Error());
      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update()', () => {
    it('devrait mettre à jour une catégorie', async () => {
      const dto = { label: 'Modifié' };
      const mockCat = { id: 4, label: 'Modifié' };
      (prisma.category.update as jest.Mock).mockResolvedValue(mockCat);

      const result = await service.update(4, dto as any);

      expect(prisma.category.update).toHaveBeenCalledWith({
        data: dto,
        where: { id: 4 },
        select: { id: true, label: true },
      });
      expect(result).toEqual({
        data: mockCat,
        message: 'Catégorie mis à jour avec succès',
      });
    });

    it('devrait lever NotFoundException si aucune catégorie à mettre à jour', async () => {
      (prisma.category.update as jest.Mock).mockResolvedValue(null);
      await expect(service.update(5, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('devrait lever BadRequestException sur duplication (P2002)', async () => {
      (prisma.category.update as jest.Mock).mockRejectedValue({
        code: 'P2002',
      });
      await expect(service.update(6, {} as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('devrait lever InternalServerErrorException sur erreur inconnue', async () => {
      (prisma.category.update as jest.Mock).mockRejectedValue(new Error());
      await expect(service.update(7, {} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove()', () => {
    it('devrait supprimer une catégorie existante', async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue({ id: 8 });
      (prisma.category.delete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.remove(8);
      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: 8 },
      });
      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: { id: 8 },
      });
      expect(result).toEqual({ message: 'Catégorie supprimé avec succès' });
    });

    it('devrait lever NotFoundException si introuvable', async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.remove(9)).rejects.toThrow(NotFoundException);
    });

    it('devrait lever ForbiddenException sur contrainte (P2003)', async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue({ id: 9 });
      (prisma.category.delete as jest.Mock).mockRejectedValue({
        code: 'P2003',
      });
      await expect(service.remove(9)).rejects.toThrow(ForbiddenException);
    });

    it('devrait lever InternalServerErrorException sur erreur inconnue', async () => {
      (prisma.category.findUnique as jest.Mock).mockImplementation(() => {
        throw new Error();
      });
      await expect(service.remove(10)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
