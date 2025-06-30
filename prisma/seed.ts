import { PrismaClient } from '@prisma/client';
import { createCitizen } from './data/user';
import { generateRessourcesSeed } from './data/article';
import { categories } from './data/categories';
import { faker } from '@faker-js/faker';
import { UserService } from 'src/user/user.service';
import { ClerkService } from 'src/auth/clerk.service';
import { PrismaService } from 'src/prisma.service';

const prisma = new PrismaClient();
const citizenService = new UserService(
  new PrismaService(),
  new ClerkService(),
);


async function main() {
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.category.deleteMany();

  console.log('Toutes les données ont été supprimées avec succès !');

  const superAdmin = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
    },
  });

  const admin = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
    },
  });
  const moderator = await prisma.role.upsert({
    where: { name: 'MODERATOR' },
    update: {},
    create: {
      name: 'MODERATOR',
    },
  });

  const user = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
    },
  });

  void createCitizen([admin, moderator, user, superAdmin]);

  await citizenService.createWithClerk({
    clerkId: 'user_2wtYZz0bJnblZfMsiNxAaXO47dG',
  });

  console.log('Utilisateur Clerk demo créé en BDD');

  const demoCitizen = await prisma.user.findUnique({
    where: { clerkId: 'user_2wtYZz0bJnblZfMsiNxAaXO47dG' },
  });

  if (!demoCitizen) {
    throw new Error('Impossible de retrouver le citoyen de demo avec Clerk');
  }

  await prisma.category.createMany({
    data: categories,
  });

  console.log('Les catégories ont été insérées avec succès !');

  const bddCategories = await prisma.category.findMany();

  const generatedRessources = generateRessourcesSeed(
    bddCategories.map((cat) => cat.id),
  );

  await prisma.article.createMany({
    data: generatedRessources,
  });

  console.log('Les ressources ont été insérées avec succès !');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
