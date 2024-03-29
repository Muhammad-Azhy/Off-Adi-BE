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
const FavBookDTO_1 = require("./FavBookDTO");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/FavBook/:ID/:BookID", middlewere_1.verifyToken, FavBookDTO_1.FavBookMiddlewere, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.ID;
    const BookID = req.params.BookID;
    let id;
    let favBooks = yield prisma.favBooks.findFirst({ where: {
            ListenerID: +ID
        } });
    if (!favBooks) {
        yield prisma.favBooks.create({
            data: {
                BookID: +BookID,
                ListenerID: +ID,
                Books: {
                    connect: { ID: +BookID }
                }
            }
        }).then(x => {
            id = x.ID;
        });
    }
    yield prisma.favBooks.update({ where: { ID: id }, data: {
            Books: { connect: { ID: +BookID } }
        } }).then(x => {
        return res.send(x);
    });
}));
router.delete("/FavBook/:ID/:BookID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.ID;
    let id;
    const BookID = req.params.BookID;
    let favBooks = yield prisma.favBooks.findFirst({ where: {
            ListenerID: +ID
        } });
    if (!favBooks) {
        yield prisma.favBooks.create({
            data: {
                BookID: +BookID,
                ListenerID: +ID,
                Books: {
                    connect: { ID: +BookID }
                }
            }
        }).then(x => {
            id = x.ID;
        });
    }
    yield prisma.favBooks.update({ where: { ID: id }, data: {
            Books: { disconnect: { ID: +BookID } }
        } }).then(x => {
        return res.send(x);
    });
}));
router.get("/FavBook/:ID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.ID;
    const listener = yield prisma.listeners.findFirst({ where: { ID: +ID } });
    if (!listener) {
        return res.send("Id not valid user not found...");
    }
    let favBooks = yield prisma.favBooks.findFirst({ where: { ListenerID: +ID } });
    if (!favBooks)
        return res.send("You have no fav books...");
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const booksPerPage = parseInt(req.query.limit, 10);
    const books = yield prisma.books.findMany({
        where: { FavBooks: { every: { ListenerID: listener.ID } } },
        select: {
            ID: true,
            Author: { select: { AuthorFullName: true, ID: true } },
            Title: true,
            Narrator: true
        },
        skip: (page - 1) * booksPerPage,
        take: booksPerPage
    });
    return res.send(books);
}));
exports.default = router;
