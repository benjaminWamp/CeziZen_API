/*
  Warnings:

  - A unique constraint covering the columns `[citizenId]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `citizenId` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `role` ADD COLUMN `citizenId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Role_citizenId_key` ON `Role`(`citizenId`);

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_citizenId_fkey` FOREIGN KEY (`citizenId`) REFERENCES `Citizen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
