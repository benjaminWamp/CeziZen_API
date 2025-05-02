/*
  Warnings:

  - You are about to drop the column `roleId` on the `citizen` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `citizen` DROP FOREIGN KEY `Citizen_id_fkey`;

-- DropIndex
DROP INDEX `Citizen_roleId_key` ON `citizen`;

-- AlterTable
ALTER TABLE `citizen` DROP COLUMN `roleId`;
