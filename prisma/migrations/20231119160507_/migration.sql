-- DropForeignKey
ALTER TABLE `bookrating` DROP FOREIGN KEY `BookRating_BookID_fkey`;

-- DropForeignKey
ALTER TABLE `listningtime` DROP FOREIGN KEY `ListningTime_BookID_fkey`;

-- AddForeignKey
ALTER TABLE `ListningTime` ADD CONSTRAINT `ListningTime_BookID_fkey` FOREIGN KEY (`BookID`) REFERENCES `Books`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookRating` ADD CONSTRAINT `BookRating_BookID_fkey` FOREIGN KEY (`BookID`) REFERENCES `Books`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
