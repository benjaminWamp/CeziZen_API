/*
  Warnings:

  - You are about to drop the `ressourcetype` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ressource` DROP FOREIGN KEY `Ressource_typeRessourceId_fkey`;

-- DropIndex
DROP INDEX `Ressource_typeRessourceId_fkey` ON `ressource`;

-- DropTable
DROP TABLE `ressourcetype`;

-- CreateTable
CREATE TABLE `TypeRessource` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_typeRessourceId_fkey` FOREIGN KEY (`typeRessourceId`) REFERENCES `TypeRessource`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
