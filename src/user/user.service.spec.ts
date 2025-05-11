/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
jest.mock('@clerk/clerk-sdk-node', () => ({
  clerkClient: {
    users: {
      create: jest.fn(),
      getUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    },
  },
}));
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { ClerkService } from 'src/auth/clerk.service';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;
  let clerkService: ClerkService;

  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  } as any;

  const mockClerkService = {
    getClerkUser: jest.fn(),
    createClerkUser: jest.fn(),
    updateClerkUser: jest.fn(),
    deleteClerkUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ClerkService, useValue: mockClerkService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    clerkService = module.get<ClerkService>(ClerkService);
  });

  describe('create()', () => {
    it('should create a user successfully', async () => {
      const dto = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123!?',
      };

      const fakeClerkUser = {
        id: 'clerk-123',
        firstName: 'Test',
        lastName: 'User',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
      };

      const fakeUser = {
        id: 42,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        clerkId: 'clerk-123',
        password: 'password123!?',
      };

      mockClerkService.getClerkUser.mockResolvedValue(undefined);
      mockClerkService.createClerkUser.mockResolvedValue(fakeClerkUser);
      mockPrisma.user.create.mockResolvedValue(fakeUser);

      const result = await service.create(dto as any);

      expect(result).toEqual({
        data: fakeUser,
        message: 'Utilisateur créé avec succès',
      });
    });

    it('should throw BadRequestException on duplicate error (P2002)', async () => {
      const dto = { email: 'dup@example.com' };

      mockClerkService.getClerkUser.mockResolvedValue(null);
      mockClerkService.createClerkUser.mockResolvedValue({
        id: 'clerk-dup',
        firstName: '',
        lastName: '',
        emailAddresses: [{ emailAddress: 'dup@example.com' }],
      });

      mockPrisma.user.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.create(dto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne()', () => {
    it('should return the user when found', async () => {
      const fakeUser = { id: 1, email: 'foo@bar.com' };
      mockPrisma.user.findUnique.mockResolvedValue(fakeUser);

      const result = await service.findOne(1);
      expect(result).toEqual({
        data: fakeUser,
        message: 'Utilisateur trouvé',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error('boom'));
      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll()', () => {
    it('should return paginated users', async () => {
      const fakeUsers = [{ id: 1 }, { id: 2 }];
      mockPrisma.user.findMany.mockResolvedValue(fakeUsers);

      const result = await service.findAll(1, 10);
      expect(result).toEqual({
        data: fakeUsers,
        message: 'Utilisateurs récupérés',
      });
    });

    it('should throw BadRequestException on invalid params', async () => {
      await expect(service.findAll(0, 10)).rejects.toThrow(BadRequestException);
      await expect(service.findAll(1, 0)).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      mockPrisma.user.findMany.mockRejectedValue(new Error('boom'));
      await expect(service.findAll(1, 10)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update()', () => {
    it('should update a user successfully', async () => {
      const dto = { firstName: 'New' };
      const fakeUser = { id: 1, firstName: 'New' };

      mockClerkService.updateClerkUser.mockResolvedValue({} as any);
      mockPrisma.user.update.mockResolvedValue(fakeUser);

      const result = await service.update(1, dto as any);
      expect(result).toEqual({
        data: fakeUser,
        message: 'Utilisateur mis à jour',
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockClerkService.updateClerkUser.mockResolvedValue({} as any);
      mockPrisma.user.update.mockRejectedValue({ code: 'P2025' });

      await expect(service.update(1, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException on duplicate', async () => {
      mockClerkService.updateClerkUser.mockResolvedValue({} as any);
      mockPrisma.user.update.mockRejectedValue({ code: 'P2002' });

      await expect(service.update(1, {} as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      mockClerkService.updateClerkUser.mockResolvedValue({} as any);
      mockPrisma.user.update.mockRejectedValue(new Error('boom'));

      await expect(service.update(1, {} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove()', () => {
    it('should delete a user successfully', async () => {
      mockClerkService.deleteClerkUser.mockResolvedValue(undefined);
      mockPrisma.user.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);
      expect(result).toEqual({
        message: 'Utilisateur 1 supprimé',
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockClerkService.deleteClerkUser.mockResolvedValue(undefined);
      mockPrisma.user.delete.mockRejectedValue({ code: 'P2025' });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      mockClerkService.deleteClerkUser.mockResolvedValue(undefined);
      mockPrisma.user.delete.mockRejectedValue(new Error('boom'));

      await expect(service.remove(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
