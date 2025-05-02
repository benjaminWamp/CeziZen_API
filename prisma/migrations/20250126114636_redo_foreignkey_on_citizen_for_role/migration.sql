-- DropForeignKey
ALTER TABLE `citizen` DROP FOREIGN KEY `Citizen_roleId_fkey`;

-- DropIndex
DROP INDEX `Citizen_roleId_key` ON `citizen`;

-- AddForeignKey
ALTER TABLE `Citizen` ADD CONSTRAINT `Citizen_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
