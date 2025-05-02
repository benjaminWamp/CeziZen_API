/*
  Warnings:

  - You are about to drop the column `citizenId` on the `role` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roleId]` on the table `Citizen` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roleId` to the `Citizen` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `Role_citizenId_fkey`;

-- DropIndex
DROP INDEX `Role_citizenId_key` ON `role`;

-- AlterTable
ALTER TABLE `citizen` ADD COLUMN `roleId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `role` DROP COLUMN `citizenId`;

-- CreateIndex
CREATE UNIQUE INDEX `Citizen_roleId_key` ON `Citizen`(`roleId`);

-- AddForeignKey
ALTER TABLE `Citizen` ADD CONSTRAINT `Citizen_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
