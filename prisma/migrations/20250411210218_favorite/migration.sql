-- CreateTable
CREATE TABLE `Favorite` (
    `id` VARCHAR(191) NOT NULL,
    `citizenId` VARCHAR(191) NOT NULL,
    `ressourceId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Favorite_citizenId_ressourceId_key`(`citizenId`, `ressourceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_citizenId_fkey` FOREIGN KEY (`citizenId`) REFERENCES `Citizen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_ressourceId_fkey` FOREIGN KEY (`ressourceId`) REFERENCES `Ressource`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
