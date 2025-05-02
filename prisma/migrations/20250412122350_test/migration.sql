/*
  Warnings:

  - You are about to alter the column `path` on the `file` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `url` on the `image` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `file` MODIFY `path` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `image` MODIFY `url` VARCHAR(191) NOT NULL;
