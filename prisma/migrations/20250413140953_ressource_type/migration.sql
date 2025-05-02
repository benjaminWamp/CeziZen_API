/*
  Warnings:

  - Added the required column `resourceTypeId` to the `Ressource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ressource` ADD COLUMN `resourceTypeId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `RessourceType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_resourceTypeId_fkey` FOREIGN KEY (`resourceTypeId`) REFERENCES `RessourceType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
