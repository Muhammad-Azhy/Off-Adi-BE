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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const middlewere_1 = require("../../middlewere");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.delete("/Library/:BookID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const BookID = req.params.BookID;
    const decodedToken = req.decodedToken;
    const ID = decodedToken.ID;
    const listener = yield prisma.listeners.findFirst({ where: { ID: +ID } });
    if (!listener) {
        return res.send("Id not valid user not found...");
    }
    const book = yield prisma.books.findFirst({ where: { ID: +BookID } });
    if (!book)
        return res.send("Book not found...");
    let library = yield prisma.library.findFirst({ where: { ListenerID: +ID } });
    if (!library) {
        return res.send("No book to delete");
    }
    yield prisma.library.update({ where: { ID: library.ID }, data: {
            book: {
                disconnect: {
                    ID: +BookID
                }
            }
        } }).then(x => {
        return res.send(x);
    });
}));
router.get("/Library", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.decodedToken;
    const ID = decodedToken.ID;
    const listener = yield prisma.listeners.findFirst({ where: { ID: +ID } });
    if (!listener) {
        return res.send("Id not valid user not found...");
    }
    let library = yield prisma.library.findFirst({ where: { ListenerID: +ID } });
    if (!library) {
        yield prisma.library.create({ data: { ListenerID: ID } });
        return res.send("You have no books...");
    }
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const booksPerPage = parseInt(req.query.limit, 10);
    //     const books = await prisma.books.findMany({
    //     where:{libraries:{every:{ListenerID:listener.ID}}},
    //     select: {
    //         ID: true,
    //         Author: { select: { AuthorFullName: true, ID: true } },
    //         Title: true,
    //         Narrator: true,
    //         Files:{select:{Cover:true , Demo:true ,Audio:true}},
    //         ListningTime:{
    //             select:{
    //                 ID:true,
    //                 Time:true,
    //                 Finished:true,
    //                 BookID:true
    //             }
    //         }
    //     },
    //     skip: (page - 1) * booksPerPage,
    //     take: booksPerPage
    // });
    const books = yield prisma.library.findFirst({
        where: {
            ListenerID: listener.ID,
        },
        select: {
            book: { select: { ID: true,
                    Author: { select: { AuthorFullName: true, ID: true } },
                    Title: true,
                    Summary: true,
                    Narrator: true,
                    Files: { select: { Cover: true, Demo: true, Audio: true } },
                    ListningTime: { where: {
                            ListenerID: listener.ID
                        } }
                } },
        },
        skip: (page - 1) * booksPerPage,
        take: booksPerPage
    });
    return res.send(books);
}));
router.get("/Library/:BookID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.BookID;
    const listener = yield prisma.listeners.findFirst({ where: { ID: +ID } });
    if (!listener) {
        return res.send("Id not valid user not found...");
    }
    let library = yield prisma.library.findFirst({ where: { ListenerID: +ID } });
    if (!library)
        return res.send("You have no books...");
    const books = yield prisma.books.findMany({
        where: { libraries: { every: { ListenerID: listener.ID } } },
        select: {
            ID: true,
            Author: { select: { AuthorFullName: true, ID: true } },
            Title: true,
            Narrator: true,
            Files: { select: { Cover: true, Demo: true, Audio: true } },
            Summary: true
        },
    }).then(x => {
        res.send(x);
    });
}));
exports.default = router;
