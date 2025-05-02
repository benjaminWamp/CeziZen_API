/*
  Warnings:

  - You are about to drop the column `banner` on the `ressource` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `ressource` table. All the data in the column will be lost.
  - Added the required column `ressourceId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comment` ADD COLUMN `ressourceId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_ressourceId_fkey` FOREIGN KEY (`ressourceId`) REFERENCES `Ressource`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
