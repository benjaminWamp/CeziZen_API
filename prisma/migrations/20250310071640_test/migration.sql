-- DropForeignKey
ALTER TABLE `resource` DROP FOREIGN KEY `Resource_categoryId_fkey`;

-- DropIndex
DROP INDEX `Resource_categoryId_fkey` ON `Resource`;

-- AlterTable
ALTER TABLE `Resource` MODIFY `categoryId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Resource` ADD CONSTRAINT `Resource_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
