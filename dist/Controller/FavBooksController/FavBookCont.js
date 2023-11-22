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
router.post("/FavBook/:BookID", middlewere_1.verifyToken, FavBookDTO_1.FavBookMiddlewere, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.decodedToken;
    const ID = decodedToken.ID;
    const BookID = req.params.BookID;
    console.log(BookID);
    let id;
    let favBooks = yield prisma.favBooks.findFirst({ where: {
            ListenerID: +ID
        } });
    if (!favBooks) {
        console.log("DOESN'T HAVE IT BOOOO");
        yield prisma.favBooks.create({
            data: {
                BookID: +BookID,
                ListenerID: +ID,
                Books: {
                    connect: { ID: +BookID }
                }
            }
        }).then((x) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.favBooks.update({ where: { ID: x.ID }, data: {
                    Books: { connect: { ID: +BookID } }
                } }).then(y => { return res.send("Book " + BookID + " Added"); });
        }));
    }
    else {
        yield prisma.favBooks.update({ where: { ID: favBooks.ID }, data: {
                Books: { connect: { ID: +BookID } }
            } }).then(x => {
            return res.send(x);
        });
    }
}));
router.delete("/FavBook/:BookID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = req.decodedToken;
        const ID = decodedToken.ID;
        let id;
        const BookID = req.params.BookID;
        let favBooks = yield prisma.favBooks.findFirst({ where: {
                ListenerID: +ID
            } });
        if (!favBooks) {
            console.log("DOESN'T HAVE IT BOOOO");
            yield prisma.favBooks.create({
                data: {
                    BookID: +BookID,
                    ListenerID: +ID,
                    Books: {
                        connect: { ID: +BookID }
                    }
                }
            }).then((x) => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma.favBooks.update({ where: { ID: +BookID, ListenerID: ID }, data: {
                        Books: { disconnect: { ID: +BookID } }
                    } }).then(y => {
                    return res.send("Removed " + BookID + " from fav");
                });
            }));
        }
        yield prisma.favBooks.update({ where: { ID: favBooks.ID, ListenerID: ID }, data: {
                Books: { disconnect: { ID: +BookID } }
            } }).then(x => {
            return res.send("Removed " + BookID + " from fav");
        });
    }
    catch (e) {
        console.log(e);
        res.send("Error removing book ");
    }
}));
router.get("/FavBook", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.decodedToken;
    const ID = decodedToken.ID;
    const listener = yield prisma.listeners.findFirst({ where: { ID: +ID } });
    if (!listener) {
        return res.send("Id not valid user not found...");
    }
    let favBooks = yield prisma.favBooks.findFirst({ where: { ListenerID: +ID } });
    if (!favBooks)
        return res.send("You have no fav books...");
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const booksPerPage = parseInt(req.query.limit, 10);
    const books = yield prisma.favBooks.findFirst({ where: { ID: favBooks.ID }, select: {
            Books: { select: { ID: true,
                    Author: { select: { AuthorFullName: true, ID: true } },
                    Title: true,
                    Summary: true,
                    Narrator: true,
                    Files: { select: { Cover: true, Demo: true, Audio: true } },
                    ListningTime: { where: {
                            ListenerID: listener.ID
                        }, } },
                skip: (page - 1) * booksPerPage,
                take: booksPerPage
            }
        } });
    return res.send(books);
}));
exports.default = router;
