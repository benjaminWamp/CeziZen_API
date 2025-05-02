/*
  Warnings:

  - Added the required column `ressourceId` to the `Progression` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `progression` ADD COLUMN `ressourceId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Progression` ADD CONSTRAINT `Progression_ressourceId_fkey` FOREIGN KEY (`ressourceId`) REFERENCES `Ressource`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
