/*
  Warnings:

  - Added the required column `stepId` to the `Progression` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `progression` ADD COLUMN `stepId` VARCHAR(191) NOT NULL,
    MODIFY `completed` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Progression` ADD CONSTRAINT `Progression_stepId_fkey` FOREIGN KEY (`stepId`) REFERENCES `Step`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
