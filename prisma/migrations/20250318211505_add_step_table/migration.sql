-- CreateTable
CREATE TABLE `Step` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `ressourceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Step` ADD CONSTRAINT `Step_ressourceId_fkey` FOREIGN KEY (`ressourceId`) REFERENCES `Ressource`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
