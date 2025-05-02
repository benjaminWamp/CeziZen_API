-- CreateTable
CREATE TABLE `Progression` (
    `id` VARCHAR(191) NOT NULL,
    `completed` BOOLEAN NOT NULL,
    `dateCompleted` DATETIME(3) NULL,
    `citizenId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Progression` ADD CONSTRAINT `Progression_citizenId_fkey` FOREIGN KEY (`citizenId`) REFERENCES `Citizen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
