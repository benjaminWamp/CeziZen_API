-- AlterTable
ALTER TABLE `ressource` ADD COLUMN `citizenId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_citizenId_fkey` FOREIGN KEY (`citizenId`) REFERENCES `Citizen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
