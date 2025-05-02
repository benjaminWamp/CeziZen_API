/*
  Warnings:

  - You are about to drop the column `resourceTypeId` on the `ressource` table. All the data in the column will be lost.
  - Added the required column `ressourceTypeId` to the `Ressource` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ressource` DROP FOREIGN KEY `Ressource_resourceTypeId_fkey`;

-- DropIndex
DROP INDEX `Ressource_resourceTypeId_fkey` ON `ressource`;

-- AlterTable
ALTER TABLE `ressource` DROP COLUMN `resourceTypeId`,
    ADD COLUMN `ressourceTypeId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_ressourceTypeId_fkey` FOREIGN KEY (`ressourceTypeId`) REFERENCES `RessourceType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
