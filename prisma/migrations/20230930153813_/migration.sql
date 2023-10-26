/*
  Warnings:

  - You are about to drop the column `UserLogin` on the `listeners` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Username]` on the table `Listeners` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Username` to the `Listeners` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Listeners_UserLogin_key` ON `listeners`;

-- AlterTable
ALTER TABLE `listeners` DROP COLUMN `UserLogin`,
    ADD COLUMN `Username` VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Listeners_Username_key` ON `Listeners`(`Username`);
