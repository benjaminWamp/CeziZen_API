/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { ArticleService } from './article.service';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

describe('ArticleService', () => {
  let service: ArticleService;
  let prisma: PrismaService;

  // Mocks pour PrismaService
  const mockPrisma = {
    article: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('devrait créer un article et le retourner', async () => {
      const dto: CreateArticleDto = {
        label: 'Toto',
        description: 'Desc',
        content: 'Contenu',
        categoryId: 1,
        userId: 2,
      };
      const created = { id: 123 };
      const full = {
        id: 123,
        label: 'Toto',
        description: 'Desc',
        content: 'Contenu',
        category: { id: 1, label: 'Cat' },
        user: { id: 2, firstname: 'A', lastname: 'B' },
        articleImages: [],
      };

      mockPrisma.article.create.mockResolvedValue(created);
      mockPrisma.article.findUnique.mockResolvedValue(full);

      const res = await service.create(dto);

      expect(prisma.article.create).toHaveBeenCalledWith({
        data: { ...dto, userId: dto.userId },
        select: { id: true },
      });
      expect(prisma.article.findUnique).toHaveBeenCalledWith({
        where: { id: created.id },
        select: expect.any(Object),
      });
      expect(res).toEqual({ data: full, message: 'Articles créé avec succès' });
    });

    it('devrait lever BadRequestException sur conflit P2002', async () => {
      (prisma.article.create as jest.Mock).mockRejectedValue({ code: 'P2002' });
      await expect(service.create({} as any)).rejects.toThrow(BadRequestException);
    });

    it('devrait lever InternalServerErrorException sinon', async () => {
      (prisma.article.create as jest.Mock).mockRejectedValue(new Error('x'));
      await expect(service.create({} as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll()', () => {
    it('devrait retourner une page d’articles', async () => {
      const items = [{ id: 1, label: 'L', description: 'D', content: 'C', category: { id:1,label:'C' }, user: { id:2, firstname:'A', lastname:'B' }, articleImages: [] }];
      mockPrisma.article.findMany.mockResolvedValue(items);
      mockPrisma.article.count.mockResolvedValue(42);

      const res = await service.findAll(2, 5, 'createdAt', 'asc');

      expect(prisma.article.findMany).toHaveBeenCalledWith(expect.objectContaining({
        skip: 5,
        take: 5,
        orderBy: { createdAt: 'asc' },
        select: expect.any(Object),
      }));
      expect(res).toEqual({
        data: items,
        total: 42,
        page: 2,
        pageSize: 5,
        message: 'Articles récupérés avec succès',
      });
    });

    it('devrait lever NotFoundException si pas d’articles', async () => {
      mockPrisma.article.findMany.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });

    it('devrait lever BadRequestException sur paramètres invalides', async () => {
      await expect(service.findAll(0, 10)).rejects.toThrow(BadRequestException);
      await expect(service.findAll(1, 101)).rejects.toThrow(BadRequestException);
      await expect(service.findAll(1, 10, 'foo' as any)).rejects.toThrow(BadRequestException);
      await expect(service.findAll(1, 10, 'createdAt', 'foo' as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne()', () => {
    it('devrait retourner un article existant', async () => {
      const art = { id: 7, label: 'X', description: 'Y', content: 'Z', category:{id:1,label:'C'}, user:{id:2,firstname:'A',lastname:'B'}, articleImages: [] };
      mockPrisma.article.findUnique.mockResolvedValue(art);

      const res = await service.findOne(7);
      expect(prisma.article.findUnique).toHaveBeenCalledWith({
        where: { id: 7 },
        select: expect.any(Object),
      });
      expect(res).toEqual({ data: art, message: 'Articles récupéré avec succès' });
    });

    it('devrait lever NotFoundException si introuvable', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(null);
      await expect(service.findOne(8)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUserArticle()', () => {
    it('devrait retourner les articles d’un utilisateur', async () => {
      const arr = [{ id:1, label:'A', description:'D', content:'C', user:{id:2,firstname:'A',lastname:'B'}, articleImages: [] }];
      mockPrisma.article.findMany.mockResolvedValue(arr);
      const res = await service.findUserArticle(2);
      expect(prisma.article.findMany).toHaveBeenCalledWith({
        where: { userId: 2 },
        select: expect.any(Object),
      });
      expect(res).toEqual({ data: arr, message: 'Articles récupéré avec succès' });
    });

    it('devrait lever NotFoundException si null', async () => {
      mockPrisma.article.findMany.mockResolvedValue(null);
      await expect(service.findUserArticle(3)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('devrait mettre à jour un article', async () => {
      const dto: UpdateArticleDto = { label: 'N', description: 'D2', content:'C2', categoryId:1 };
      const upd = { id:5, ...dto, category:{id:1,label:'C'}, user:{id:2, firstname:'A',lastname:'B'}, articleImages: [] };
      mockPrisma.article.update.mockResolvedValue(upd);

      const res = await service.update(5, dto);
      expect(prisma.article.update).toHaveBeenCalledWith({
        data: dto,
        where: { id: 5 },
        select: expect.any(Object),
      });
      expect(res).toEqual({ data: upd, message: 'Articles mis à jour avec succès' });
    });

    it('devrait lever NotFoundException si retourne null', async () => {
      mockPrisma.article.update.mockResolvedValue(null);
      await expect(service.update(9, {} as any)).rejects.toThrow(NotFoundException);
    });

    it('devrait lever BadRequestException sur P2002', async () => {
      mockPrisma.article.update.mockRejectedValue({ code: 'P2002' });
      await expect(service.update(5, {} as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove()', () => {
    it('devrait supprimer un article existant', async () => {
      mockPrisma.article.findUnique.mockResolvedValue({ id: 10 });
      mockPrisma.article.delete.mockResolvedValue(undefined);

      const res = await service.remove(10);
      expect(prisma.article.findUnique).toHaveBeenCalledWith({ where: { id: 10 } });
      expect(prisma.article.delete).toHaveBeenCalledWith({ where: { id: 10 } });
      expect(res).toEqual({ message: 'Articles supprimé avec succès' });
    });

    it('devrait lever NotFoundException si absent', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(null);
      await expect(service.remove(11)).rejects.toThrow(NotFoundException);
    });

    it('devrait lever ForbiddenException sur P2003', async () => {
      mockPrisma.article.findUnique.mockResolvedValue({ id: 12 });
      mockPrisma.article.delete.mockRejectedValue({ code: 'P2003' });
      await expect(service.remove(12)).rejects.toThrow(ForbiddenException);
    });
  });
});
