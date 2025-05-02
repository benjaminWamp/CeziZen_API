/*
  Warnings:

  - You are about to drop the column `bannerId` on the `ressource` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `ressource` table. All the data in the column will be lost.
  - You are about to drop the `file` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ressource` DROP FOREIGN KEY `Ressource_bannerId_fkey`;

-- DropForeignKey
ALTER TABLE `ressource` DROP FOREIGN KEY `Ressource_fileId_fkey`;

-- DropIndex
DROP INDEX `Ressource_bannerId_fkey` ON `ressource`;

-- DropIndex
DROP INDEX `Ressource_fileId_fkey` ON `ressource`;

-- AlterTable
ALTER TABLE `ressource` DROP COLUMN `bannerId`,
    DROP COLUMN `fileId`,
    ADD COLUMN `banner` VARCHAR(191) NULL,
    ADD COLUMN `file` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `file`;

-- DropTable
DROP TABLE `image`;
