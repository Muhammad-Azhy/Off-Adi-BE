-- CreateTable
CREATE TABLE `Books` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `PublisherID` INTEGER NOT NULL,
    `Title` VARCHAR(250) NOT NULL,
    `AuthorID` INTEGER NOT NULL,
    `Narrator` VARCHAR(250) NOT NULL,
    `NumberOfPages` INTEGER NOT NULL,
    `Language` INTEGER NOT NULL,
    `Summary` VARCHAR(250) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Files` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `BookID` INTEGER NOT NULL,
    `Cover` VARCHAR(250) NOT NULL,
    `Audio` VARCHAR(250) NOT NULL,
    `Demo` VARCHAR(250) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `Category_Name_key`(`Name`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Listeners` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserFullName` VARCHAR(250) NOT NULL,
    `UserLogin` VARCHAR(50) NOT NULL,
    `Email` VARCHAR(50) NOT NULL,
    `Phone` VARCHAR(15) NOT NULL,
    `Password` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `Listeners_UserLogin_key`(`UserLogin`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ListningTime` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `BookID` INTEGER NOT NULL,
    `ListenerID` INTEGER NOT NULL,
    `Time` VARCHAR(50) NOT NULL,
    `Finished` BOOLEAN NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Author` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `AuthorFullName` VARCHAR(50) NOT NULL,
    `Email` VARCHAR(50) NOT NULL,
    `Phone` VARCHAR(15) NOT NULL,

    UNIQUE INDEX `Author_AuthorFullName_key`(`AuthorFullName`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Library` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ListenerID` INTEGER NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavBooks` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ListenerID` INTEGER NOT NULL,
    `BookID` INTEGER NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookRating` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `BookID` INTEGER NOT NULL,
    `ReaderID` INTEGER NOT NULL,
    `Rating` INTEGER NOT NULL,
    `Review` VARCHAR(250) NOT NULL,
    `RatingDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Publisher` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `PublisherName` VARCHAR(50) NOT NULL,
    `Email` VARCHAR(50) NOT NULL,
    `Phone` VARCHAR(15) NOT NULL,
    `Website` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cart` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,

    UNIQUE INDEX `Cart_UserID_key`(`UserID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BooksToLibrary` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BooksToLibrary_AB_unique`(`A`, `B`),
    INDEX `_BooksToLibrary_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BooksToFavBooks` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BooksToFavBooks_AB_unique`(`A`, `B`),
    INDEX `_BooksToFavBooks_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BooksToCategory` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BooksToCategory_AB_unique`(`A`, `B`),
    INDEX `_BooksToCategory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BooksToCart` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BooksToCart_AB_unique`(`A`, `B`),
    INDEX `_BooksToCart_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Books` ADD CONSTRAINT `Books_AuthorID_fkey` FOREIGN KEY (`AuthorID`) REFERENCES `Author`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Books` ADD CONSTRAINT `Books_PublisherID_fkey` FOREIGN KEY (`PublisherID`) REFERENCES `Publisher`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_BookID_fkey` FOREIGN KEY (`BookID`) REFERENCES `Books`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Library` ADD CONSTRAINT `Library_ListenerID_fkey` FOREIGN KEY (`ListenerID`) REFERENCES `Listeners`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavBooks` ADD CONSTRAINT `FavBooks_ListenerID_fkey` FOREIGN KEY (`ListenerID`) REFERENCES `Listeners`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookRating` ADD CONSTRAINT `BookRating_BookID_fkey` FOREIGN KEY (`BookID`) REFERENCES `Books`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookRating` ADD CONSTRAINT `BookRating_ReaderID_fkey` FOREIGN KEY (`ReaderID`) REFERENCES `Listeners`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `Listeners`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BooksToLibrary` ADD CONSTRAINT `_BooksToLibrary_A_fkey` FOREIGN KEY (`A`) REFERENCES `Books`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BooksToLibrary` ADD CONSTRAINT `_BooksToLibrary_B_fkey` FOREIGN KEY (`B`) REFERENCES `Library`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BooksToFavBooks` ADD CONSTRAINT `_BooksToFavBooks_A_fkey` FOREIGN KEY (`A`) REFERENCES `Books`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BooksToFavBooks` ADD CONSTRAINT `_BooksToFavBooks_B_fkey` FOREIGN KEY (`B`) REFERENCES `FavBooks`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BooksToCategory` ADD CONSTRAINT `_BooksToCategory_A_fkey` FOREIGN KEY (`A`) REFERENCES `Books`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BooksToCategory` ADD CONSTRAINT `_BooksToCategory_B_fkey` FOREIGN KEY (`B`) REFERENCES `Category`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BooksToCart` ADD CONSTRAINT `_BooksToCart_A_fkey` FOREIGN KEY (`A`) REFERENCES `Books`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BooksToCart` ADD CONSTRAINT `_BooksToCart_B_fkey` FOREIGN KEY (`B`) REFERENCES `Cart`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
