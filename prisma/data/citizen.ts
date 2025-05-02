import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { Role as RoleModel } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fonction utilitaire pour renvoyer l'id d'un rôle aléatoire.
 * @param roles - Tableau des rôles.
 * @returns L'id du rôle.
 */
function switchRole(roles: RoleModel[]) {
  return roles[Math.floor(Math.random() * roles.length)].id;
}

/**
 * Fonction utilitaire pour créer 10 utilisateurs.
 * @param roles - Tableau des rôles attribuable.
 */
export async function createCitizen(roles: RoleModel[]) {
  for (let i = 0; i < 10; i++) {
    await prisma.citizen.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        roleId: switchRole(roles),
        clerkId: `fakeId+${i}`,
      },
    });
  }
}
