/*
  Warnings:

  - You are about to alter the column `Summary` on the `books` table. The data in that column could be lost. The data in that column will be cast from `VarChar(250)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `books` MODIFY `Summary` VARCHAR(191) NOT NULL;
