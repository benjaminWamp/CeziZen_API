/*
  Warnings:

  - You are about to drop the column `ressourceTypeId` on the `ressource` table. All the data in the column will be lost.
  - Added the required column `typeRessourceId` to the `Ressource` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ressource` DROP FOREIGN KEY `Ressource_ressourceTypeId_fkey`;

-- DropIndex
DROP INDEX `Ressource_ressourceTypeId_fkey` ON `ressource`;

-- AlterTable
ALTER TABLE `ressource` DROP COLUMN `ressourceTypeId`,
    ADD COLUMN `typeRessourceId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_typeRessourceId_fkey` FOREIGN KEY (`typeRessourceId`) REFERENCES `RessourceType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
