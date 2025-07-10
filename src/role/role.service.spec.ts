import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

describe('RoleService', () => {
  let service: RoleService;
  let prisma: Partial<Record<keyof PrismaService, any>>;

  beforeEach(async () => {
    prisma = {
      role: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(RoleService);
  });

  describe('create()', () => {
    const dto: CreateRoleDto = { name: 'Admin' };

    it('devrait créer un rôle avec succès', async () => {
      const mockRole = { id: 1, name: 'Admin' };
      (prisma.role.create as jest.Mock).mockResolvedValue(mockRole);

      const result = await service.create(dto);
      expect(prisma.role.create).toHaveBeenCalledWith({
        data: dto,
        select: { id: true, name: true },
      });
      expect(result).toEqual({
        data: mockRole,
        message: 'Rôle créé avec succès',
      });
    });

    it('devrait lever BadRequestException sur duplication (P2002)', async () => {
      (prisma.role.create as jest.Mock).mockRejectedValue({ code: 'P2002' });
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('devrait lever InternalServerErrorException sur autre erreur', async () => {
      (prisma.role.create as jest.Mock).mockRejectedValue(new Error());
      await expect(service.create(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll()', () => {
    it('devrait retourner tous les rôles et le total', async () => {
      const roles = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ];
      (prisma.role.findMany as jest.Mock).mockResolvedValue(roles);
      (prisma.role.count as jest.Mock).mockResolvedValue(2);

      const result = await service.findAll();
      expect(prisma.role.findMany).toHaveBeenCalledWith({
        select: { id: true, name: true },
      });
      expect(prisma.role.count).toHaveBeenCalled();
      expect(result).toEqual({
        data: roles,
        total: 2,
        message: 'Rôles récupérés avec succès',
      });
    });

    it('devrait lever NotFoundException si aucune donnée', async () => {
      (prisma.role.findMany as jest.Mock).mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });

    it('devrait lever InternalServerErrorException sur erreur', async () => {
      (prisma.role.findMany as jest.Mock).mockRejectedValue(new Error());
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne()', () => {
    it('devrait retourner un rôle existant', async () => {
      const role = { id: 5, name: 'User' };
      (prisma.role.findUnique as jest.Mock).mockResolvedValue(role);

      const result = await service.findOne(5);
      expect(prisma.role.findUnique).toHaveBeenCalledWith({
        where: { id: 5 },
        select: { id: true, name: true },
      });
      expect(result).toEqual({
        data: role,
        message: 'Rôle récupéré avec succès',
      });
    });

    it('devrait lever NotFoundException si introuvable', async () => {
      (prisma.role.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('devrait lever InternalServerErrorException sur erreur', async () => {
      (prisma.role.findUnique as jest.Mock).mockRejectedValue(new Error());
      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update()', () => {
    const dto: UpdateRoleDto = { name: 'Manager' };

    it('devrait mettre à jour un rôle', async () => {
      const updated = { id: 7, name: 'Manager' };
      (prisma.role.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update(7, dto);
      expect(prisma.role.update).toHaveBeenCalledWith({
        where: { id: 7 },
        data: dto,
        select: { id: true, name: true },
      });
      expect(result).toEqual({
        data: updated,
        message: 'Rôle mis à jour avec succès',
      });
    });

    it('devrait lever BadRequestException sur duplication (P2002)', async () => {
      (prisma.role.update as jest.Mock).mockRejectedValue({ code: 'P2002' });
      await expect(service.update(7, dto)).rejects.toThrow(BadRequestException);
    });

    it('devrait lever InternalServerErrorException sur autre erreur', async () => {
      (prisma.role.update as jest.Mock).mockRejectedValue(new Error());
      await expect(service.update(7, dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove()', () => {
    it('devrait supprimer un rôle existant', async () => {
      (prisma.role.findUnique as jest.Mock).mockResolvedValue({ id: 8 });
      (prisma.role.delete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.remove(8);
      expect(prisma.role.findUnique).toHaveBeenCalledWith({
        where: { id: 8 },
      });
      expect(prisma.role.delete).toHaveBeenCalledWith({
        where: { id: 8 },
      });
      expect(result).toEqual({ message: 'Rôle supprimé avec succès' });
    });

    it('devrait lever NotFoundException si le rôle n’existe pas', async () => {
      (prisma.role.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.remove(9)).rejects.toThrow(NotFoundException);
    });

    it('devrait lever ForbiddenException sur code P2003', async () => {
      (prisma.role.findUnique as jest.Mock).mockResolvedValue({ id: 9 });
      (prisma.role.delete as jest.Mock).mockRejectedValue({ code: 'P2003' });
      await expect(service.remove(9)).rejects.toThrow(ForbiddenException);
    });

    it('devrait lever InternalServerErrorException sur autre erreur', async () => {
      (prisma.role.findUnique as jest.Mock).mockResolvedValue({ id: 10 });
      (prisma.role.delete as jest.Mock).mockRejectedValue(new Error());
      await expect(service.remove(10)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
