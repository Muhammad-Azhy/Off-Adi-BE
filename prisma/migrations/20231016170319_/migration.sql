-- AddForeignKey
ALTER TABLE `ListningTime` ADD CONSTRAINT `ListningTime_BookID_fkey` FOREIGN KEY (`BookID`) REFERENCES `Books`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
