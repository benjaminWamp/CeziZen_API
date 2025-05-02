/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `Citizen` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Citizen_clerkId_key` ON `Citizen`(`clerkId`);
