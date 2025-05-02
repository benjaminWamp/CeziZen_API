/*
  Warnings:

  - Added the required column `ressourceId` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invite` ADD COLUMN `ressourceId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Invite` ADD CONSTRAINT `Invite_ressourceId_fkey` FOREIGN KEY (`ressourceId`) REFERENCES `Ressource`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
