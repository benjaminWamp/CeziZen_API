/*
  Warnings:

  - Made the column `categoryId` on table `ressource` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `ressource` DROP FOREIGN KEY `Ressource_categoryId_fkey`;

-- DropIndex
DROP INDEX `Ressource_categoryId_fkey` ON `ressource`;

-- AlterTable
ALTER TABLE `ressource` MODIFY `categoryId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
