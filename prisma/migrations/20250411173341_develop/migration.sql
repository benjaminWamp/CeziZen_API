/*
  Warnings:

  - You are about to drop the column `banner` on the `ressource` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `ressource` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ressource` DROP COLUMN `banner`,
    DROP COLUMN `file`,
    ADD COLUMN `bannerId` VARCHAR(191) NULL,
    ADD COLUMN `fileId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_bannerId_fkey` FOREIGN KEY (`bannerId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
