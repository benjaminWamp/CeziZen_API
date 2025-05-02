// prisma/seed/resourceType.ts

import { TypeRessourceEnum } from 'src/utils/typeRessource.enum';

export const typeRessource = [
  {
    name: TypeRessourceEnum.DEFI,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: TypeRessourceEnum.ACTIVITY,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: TypeRessourceEnum.FILE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// async function main() {
//   await prisma.typeRessource.createMany({
//     data: typeRessource,
//     skipDuplicates: true,
//   });
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   // eslint-disable-next-line @typescript-eslint/no-misused-promises
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
