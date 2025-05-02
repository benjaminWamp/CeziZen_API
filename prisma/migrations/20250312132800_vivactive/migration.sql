/*
  Warnings:

  - You are about to drop the `resource` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `resource` DROP FOREIGN KEY `Resource_bannerId_fkey`;

-- DropForeignKey
ALTER TABLE `resource` DROP FOREIGN KEY `Resource_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `resource` DROP FOREIGN KEY `Resource_fileId_fkey`;

-- DropTable
DROP TABLE `resource`;

-- CreateTable
CREATE TABLE `Ressource` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `maxParticipant` INTEGER NULL,
    `nbParticipant` INTEGER NULL,
    `deadLine` DATETIME(3) NULL,
    `categoryId` VARCHAR(191) NULL,
    `fileId` VARCHAR(191) NULL,
    `bannerId` VARCHAR(191) NULL,
    `isValidate` BOOLEAN NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_bannerId_fkey` FOREIGN KEY (`bannerId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
