/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';
import {
  CreateUserDto,
  CreateUserwithClerkDTo,
} from 'src/user/dto/create-user.dto';
import {
  UpdateUserCredentialsDto,
  UpdateUserDto,
} from 'src/user/dto/update-user.dto';

@Injectable()
export class ClerkService {
  private readonly clerkApiUrl = 'https://api.clerk.com/v1/users';
  private readonly clerkSecretKey = process.env.CLERK_SECRET_KEY;

  async createClerkUser(userData: CreateUserDto) {
    try {
      const response = await clerkClient.users.createUser({
        firstName: userData.firstname,
        lastName: userData.lastname,
        emailAddress: [userData.email],
        password: userData.password,
      });
      return response;
    } catch (error) {
      console.error('Erreur Clerk:', error);
      if (error.status === 422) {
        throw new BadRequestException(
          'Une erreur est survenu, vieullez vérifier les informations transmises',
        );
      }
      throw new InternalServerErrorException(
        'Erreur lors de la création dans Clerk',
      );
    }
  }

  async updateClerkUser(clerkId: string, userData: UpdateUserDto) {
    try {
      const response = await clerkClient.users.updateUser(clerkId, {
        firstName: userData.firstname,
        lastName: userData.lastname,
      });
      return response;
    } catch (error) {
      console.error('Erreur Clerk:', error);
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour dans Clerk',
      );
    }
  }

  async updateClerkUserCredentials(
    clerkId: string,
    userData: UpdateUserCredentialsDto,
  ) {
    try {
      const response = await clerkClient.users.updateUser(clerkId, {
        password: userData.password,
      });
      return response;
    } catch (error) {
      console.error('Erreur Clerk:', error.response?.data || error.message);
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour dans Clerk',
      );
    }
  }

  async getClerkUser(userData: CreateUserwithClerkDTo) {
    if (!userData.clerkId) {
      return undefined;
    }

    try {
      const response = await clerkClient.users.getUser(userData.clerkId);
      return response;
    } catch (error) {
      console.error('Erreur Clerk:', error.response?.data || error.message);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération du citoyen dans Clerk',
      );
    }
  }

  async deleteClerkUser(id: string) {
    try {
      const response = await clerkClient.users.deleteUser(id);
      return response;
    } catch (error) {
      console.error('Erreur Clerk:', error.response?.data || error.message);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération du citoyen dans Clerk',
      );
    }
  }
}


