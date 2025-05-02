/*
  Warnings:

  - Made the column `nbParticipant` on table `ressource` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ressource` MODIFY `nbParticipant` INTEGER NOT NULL DEFAULT 0;
