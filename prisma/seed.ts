import { PrismaClient } from '@prisma/client';
import { createCitizen } from './data/citizen';
import { generateRessourcesSeed } from './data/resssource';
import { categories } from './data/categories';
import { generateStepTemplates } from './data/step';
import { gardeningComments, gardeningSteps } from './data/gardeninSteps';
import { faker } from '@faker-js/faker';
import { manualComments } from './data/comment';
import { gardeningMessages } from './data/gardeningMessage';
import { CitizenService } from 'src/citizen/citizen.service';
import { ClerkService } from 'src/auth/clerk.service';
import { PrismaService } from 'src/prisma.service';
import { ProgressionService } from 'src/progression/progression.service';
import { typeRessource } from './data/resourceType';

const prisma = new PrismaClient();
const citizenService = new CitizenService(
  new PrismaService(),
  new ClerkService(),
);

const progressionService = new ProgressionService(new PrismaService());

async function main() {
  await prisma.favorite.deleteMany();
  await prisma.message.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.progression.deleteMany();
  await prisma.step.deleteMany();
  await prisma.ressource.deleteMany();
  await prisma.citizen.deleteMany();
  await prisma.role.deleteMany();
  await prisma.category.deleteMany();
  await prisma.typeRessource.deleteMany();
  await prisma.invite.deleteMany();

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
    clerkId: 'user_2vxGqhwgYnDCxHAH3za04SvwYTG',
  });

  console.log('Utilisateur Clerk demo créé en BDD');

  const demoCitizen = await prisma.citizen.findUnique({
    where: { clerkId: 'user_2vxGqhwgYnDCxHAH3za04SvwYTG' },
  });

  if (!demoCitizen) {
    throw new Error('Impossible de retrouver le citoyen de demo avec Clerk');
  }

  await prisma.category.createMany({
    data: categories,
  });

  console.log('Les catégories ont été insérées avec succès !');

  await prisma.typeRessource.createMany({
    data: typeRessource,
    skipDuplicates: true,
  });

  console.log('Les types de ressources ont été insérés avec succès !');

  const bddCategories = await prisma.category.findMany();

  const bddResourceType = await prisma.typeRessource.findMany();

  const generatedRessources = generateRessourcesSeed(
    bddCategories.map((cat) => cat.id),
    bddResourceType[0].id,
  );

  await prisma.ressource.createMany({
    data: generatedRessources,
  });

  console.log('Les ressources ont été insérées avec succès !');

  const templates = generateStepTemplates();

  const bddRessources = await prisma.ressource.findMany();

  const gardeningRessource = await prisma.ressource.findFirst({
    where: {
      title: 'Défi Jardinage : Créez un mini potager à la maison | DEMO !',
    },
  });

  if (!gardeningRessource) {
    console.error('Ressource demo non trouvée');
  }

  const gardeningStepsToInsert = gardeningRessource
    ? gardeningSteps.map((step, index) => ({
        title: step.title,
        description: step.description,
        order: index + 1,
        ressourceId: gardeningRessource.id,
      }))
    : [];

  if (!gardeningRessource) {
    console.warn("La ressource 'Défi Jardinage' n'a pas été trouvée.");
  }

  const allSteps = bddRessources.flatMap((ressource) => {
    if (ressource.id === gardeningRessource?.id) {
      return [];
    }

    const numberOfSteps = Math.floor(Math.random() * 7) + 4;
    const shuffledTemplates = templates.sort(() => Math.random() - 0.5);
    const selectedTemplates = shuffledTemplates.slice(0, numberOfSteps);

    return selectedTemplates.map((template, index) => ({
      title: template.title,
      description: template.description,
      order: index + 1,
      ressourceId: ressource.id,
    }));
  });

  // Ajouter les étapes jardinage à la fin
  await prisma.step.createMany({
    data: [...allSteps, ...gardeningStepsToInsert],
  });

  console.log('Les étapes ont été insérées avec succès !');

  if (!gardeningRessource) {
    throw new Error('Ressource Demo introuvable');
  }

  await progressionService.initializeProgression({
    ressourceId: gardeningRessource.id,
    citizenId: demoCitizen.id,
  });

  console.log(
    'Progression initialisée pour le citoyen de demo sur la ressource Jardinage',
  );

  const citizens = await prisma.citizen.findMany();

  const comments = bddRessources.flatMap((ressource) => {
    const nbComments = faker.number.int({ min: 2, max: 6 });
    const selectedComments = faker.helpers.arrayElements(
      manualComments,
      nbComments,
    );

    return selectedComments.map((comment) => ({
      ...comment,
      ressourceId: ressource.id,
      citizenId: faker.helpers.arrayElement(citizens).id,
      createdAt: faker.date.recent({ days: 30 }),
      updatedAt: new Date(),
    }));
  });

  await prisma.comment.createMany({
    data: comments,
  });

  console.log(`${comments.length} commentaires créés pour les ressources`);

  if (gardeningRessource) {
    const citizens = await prisma.citizen.findMany();

    const seedGardeningComments = gardeningComments.map((comment) => ({
      ...comment,
      ressourceId: gardeningRessource.id,
      citizenId: faker.helpers.arrayElement(citizens).id,
      createdAt: faker.date.recent({ days: 15 }),
      updatedAt: new Date(),
    }));

    await prisma.comment.createMany({ data: seedGardeningComments });

    console.log(`${comments.length} commentaires ajoutés à la ressource demo.`);

    const randomCitizens = citizens.sort(() => Math.random() - 0.5).slice(0, 6);

    for (const citizen of randomCitizens) {
      if (citizen.id !== demoCitizen?.id) {
        await progressionService.initializeProgression({
          ressourceId: gardeningRessource.id,
          citizenId: citizen.id,
        });
      }
    }
    console.log(
      `Progression initialisée pour 5 utilisateur pour la ressource demo`,
    );
  }

  if (demoCitizen && gardeningRessource) {
    await prisma.comment.create({
      data: {
        title: 'Une belle découverte',
        description:
          "Ce défi m'a vraiment motivé à me lancer dans le jardinage urbain. Merci pour cette belle initiative !",
        citizenId: demoCitizen.id,
        ressourceId: gardeningRessource.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('Commentaire ajouté pour le citizen demo');
  }

  const citizensInGardening = await prisma.progression.findMany({
    where: { ressourceId: gardeningRessource.id },
    select: { citizen: true },
  });

  const citizensInGardeningValues = citizensInGardening.map(
    (item) => item.citizen,
  );

  for (let i = 0; i < gardeningMessages.length; i++) {
    const msg = gardeningMessages[i];
    // Un message sera posté par le citoyen demo, les autres au hasard
    const randomCitizen =
      i === 0
        ? demoCitizen
        : citizensInGardeningValues[
            Math.floor(Math.random() * citizensInGardening.length)
          ];

    await prisma.message.create({
      data: {
        message: msg.message,
        citizenId: randomCitizen.id,
        ressourceId: gardeningRessource.id,
      },
    });
  }

  console.log('Messages de demo ajoutés avec succès !');

  if (!demoCitizen) {
    console.error("Le citoyen de demo n'existe pas.");
  } else {
    const ressources = await prisma.ressource.findMany({
      take: 5,
    });

    for (const ressource of ressources) {
      await prisma.favorite.create({
        data: {
          citizenId: demoCitizen.id,
          ressourceId: ressource.id,
        },
      });
    }

    console.log(
      'Les ressources ont été ajoutées aux favoris du citizen demo !',
    );
  }
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
