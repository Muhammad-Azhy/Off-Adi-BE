"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const data_1 = require("./data");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let Author of data_1.Authors) {
            yield prisma.author.create({ data: Author });
        }
        for (let Category of data_1.Categories) {
            yield prisma.category.create({ data: Category });
        }
        for (let Publisher of data_1.Publishers) {
            yield prisma.publisher.create({ data: Publisher });
        }
        for (let Listener of data_1.Listeners) {
            yield prisma.listeners.create({
                data: Listener
            });
        }
        for (let Book of data_1.Books) {
            const author = yield prisma.author.findFirst({ where: { AuthorFullName: Book.AuthorFullName } });
            const publisher = yield prisma.publisher.findFirst({ where: { PublisherName: Book.PublisherName } });
            const books = yield prisma.books.create({
                data: {
                    PublisherID: publisher.ID,
                    AuthorID: author.ID,
                    Title: Book.Title,
                    Narrator: Book.Narrator,
                    NumberOfPages: Book.NumberOfPages,
                    Language: Book.Language,
                    Summary: Book.Summary,
                }
            });
            const files = yield prisma.files.create({
                data: {
                    BookID: books.ID,
                    Cover: Book.Cover,
                    Audio: Book.Audio,
                    Demo: Book.Demo,
                }
            });
        }
    });
}
main().catch(e => {
    console.log(e);
    process.exit(1);
}).finally(() => {
    prisma.$disconnect();
});
// model Books {
//   ID            Int          @id @default(autoincrement())
//   PublisherID   Int
//   Title         String       @db.VarChar(250)
//   AuthorID      Int
//   Narrator      String       @db.VarChar(250)
//   NumberOfPages Int
//   Language      Int
//   Summary       String       @db.VarChar(250)
//   Files         Files[]
//   Author        Author       @relation(fields: [AuthorID], references: [ID])
//   Publisher     Publisher    @relation(fields: [PublisherID], references: [ID])
//   libraries     Library[]
//   FavBooks      FavBooks[]
//   BookRatings   BookRating[]
//   Categories    Category[]
//   Cart          Cart[]
// }
