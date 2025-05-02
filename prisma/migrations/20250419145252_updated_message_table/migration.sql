/*
  Warnings:

  - You are about to drop the column `description` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `message` table. All the data in the column will be lost.
  - Added the required column `message` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ressourceId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `message` DROP COLUMN `description`,
    DROP COLUMN `title`,
    ADD COLUMN `message` VARCHAR(191) NOT NULL,
    ADD COLUMN `ressourceId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_ressourceId_fkey` FOREIGN KEY (`ressourceId`) REFERENCES `Ressource`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
