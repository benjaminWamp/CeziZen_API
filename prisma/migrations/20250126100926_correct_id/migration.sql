/*
  Warnings:

  - The primary key for the `citizen` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `role` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `citizen` DROP FOREIGN KEY `Citizen_roleId_fkey`;

-- AlterTable
ALTER TABLE `citizen` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `role` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Citizen` ADD CONSTRAINT `Citizen_id_fkey` FOREIGN KEY (`id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
