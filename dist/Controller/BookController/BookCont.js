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
const BookDTO_1 = require("./BookDTO");
const __1 = require("../..");
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.use(express_1.default.json());
router.use("/Media", express_1.default.static(path_1.default.join(__dirname, "Media")));
router.post("/Books", middlewere_1.verifyToken, BookDTO_1.CreateBookMiddlewere, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.decodedToken;
    const ID = decodedToken.ID;
    const { PublisherName, Title, Narrator, NumberOfPages, Language, Category, Summary } = req.body;
    const publisher = yield prisma.publisher.findFirst({
        where: {
            PublisherName
        }
    });
    const author = yield prisma.author.findFirst({
        where: {
            ID
        }
    });
    const book = yield prisma.books.create({
        data: {
            Categories: {
                connect: {
                    Name: Category
                }
            },
            Publisher: {
                connect: {
                    ID: publisher.ID
                }
            },
            Author: {
                connect: {
                    ID: author.ID
                }
            },
            Title,
            Narrator,
            NumberOfPages: +NumberOfPages,
            Language: +Language,
            Summary,
        }
    });
    res.send(book);
}));
router.post("/Files/:BookID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const BookID = req.params.BookID;
        const decodedToken = req.decodedToken;
        const ID = decodedToken.ID;
        (0, __1.uploader)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(500).send('Error uploading files.');
            }
            const audioFile = req.files['audio'][0];
            const coverFile = req.files['cover'][0];
            const demoFile = req.files['demo'][0];
            if (!audioFile || !coverFile || !demoFile) {
                return res.status(402).send(`missing files...`);
            }
            let book = yield prisma.books.findFirst({ where: {
                    ID: +BookID
                } });
            if (!book)
                return res.send("Book is not yours or not found");
            yield prisma.files.create({
                data: {
                    BookID: book.ID,
                    Cover: `Media/${coverFile.originalname}`,
                    Demo: `Media/${demoFile.originalname}`,
                    Audio: `Media/${audioFile.originalname}`,
                }
            }).then((x) => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma.books.update({ where: { ID: +BookID }, data: {
                        Files: { connect: { ID: x.ID } }
                    } });
            }));
            yield prisma.books.findFirst({ where: { ID: +BookID }, select: {
                    ID: true,
                    Author: true,
                    Title: true,
                    Summary: true,
                    Publisher: true,
                    NumberOfPages: true,
                    Files: true,
                } }).then(x => {
                res.send(x);
            });
        }));
    }
    catch (err) {
        console.log(err);
        return res.send("Error adding files");
    }
}));
router.put("/Books/:BookID", middlewere_1.verifyToken, BookDTO_1.UpdateBookMiddlewere, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Narrator, Summary } = req.body;
    const ID = req.params.BookID;
    const book = yield prisma.books.findFirst({ where: {
            ID: +ID
        } });
    if (!book) {
        return res.send("Book doesn't exist");
    }
    yield prisma.books.update({ where: { ID: +ID }, data: { Narrator, Summary } });
    return res.send("Book Updated...");
}));
router.delete("/Books/:BookID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.BookID;
    const book = yield prisma.books.findFirst({ where: {
            ID: +ID
        } });
    if (!book) {
        return res.send("Book doesn't exist");
    }
    yield prisma.books.delete({ where: { ID: +ID } });
    return res.send("Book Deleted...");
}));
router.get("/Books", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const BooksPerPage = parseInt(req.query.limit, 10);
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const pageNumber = isNaN(page) || page < 1 ? 1 : page;
        const maxBooks = yield prisma.books.count();
        const maxPages = Math.ceil(maxBooks / BooksPerPage);
        const books = yield prisma.books.findMany({
            skip: (pageNumber - 1) * BooksPerPage,
            take: BooksPerPage,
            select: {
                ID: true,
                Title: true,
                AuthorID: true,
                PublisherID: true,
                Summary: true,
                Language: true,
                Narrator: true,
                listenTime: {
                    select: {
                        Time: true,
                        BookID: true,
                        ListenerID: true,
                        Finished: true,
                    }
                },
                Files: {
                    select: { Cover: true, Audio: true, Demo: true }
                },
                Author: {
                    select: {
                        ID: true,
                        AuthorFullName: true,
                    },
                },
            }
        });
        res.send({
            page: pageNumber,
            maxPages,
            books,
        });
    }
    catch (err) {
        console.error("Error getting Books:", err);
        return res.status(500).send("Error getting Books...");
    }
}));
router.get("/Books/:BookID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ID = req.params.BookID;
        const book = yield prisma.books.findFirst({
            where: { ID: +ID },
            select: {
                ID: true,
                Publisher: { select: { PublisherName: true } },
                Title: true,
                Narrator: true,
                NumberOfPages: true,
                Summary: true,
                Language: true,
                Author: { select: { AuthorFullName: true, ID: true } }
            }
        });
        const files = yield prisma.files.findFirst({ where: {
                BookID: book.ID,
            }, select: { Cover: true, Audio: true, Demo: true } });
        if (!files)
            return res.send("Book not found or has no files yet...");
        res.send({ book, files });
    }
    catch (err) {
        console.error("Error getting Book:", err);
        return res.status(500).send("Error getting Book...");
    }
}));
router.get("/Category/:Name", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Name = req.params.Name;
    const BooksPerPage = parseInt(req.query.limit, 10);
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const pageNumber = isNaN(page) || page < 1 ? 1 : page;
    const maxBooks = yield prisma.books.count();
    const maxPages = Math.ceil(maxBooks / BooksPerPage);
    if (!Name)
        return res.send("Missing Name");
    Name[0].toUpperCase;
    const exist = yield prisma.category.findFirst({ where: {
            Name
        } });
    if (!exist)
        return res.send("Category doesn't exist");
    const books = yield prisma.books.findMany({
        skip: (pageNumber - 1) * BooksPerPage,
        take: BooksPerPage,
        where: {
            Categories: {
                every: {
                    Name
                }
            }
        },
        select: {
            ID: true,
            Title: true,
            AuthorID: true,
            PublisherID: true,
            Summary: true,
            Language: true,
            Narrator: true,
            Files: {
                select: { Cover: true, Audio: true, Demo: true }
            },
            Author: {
                select: {
                    ID: true,
                    AuthorFullName: true,
                },
            },
        }
    });
    res.send({
        page: pageNumber,
        maxPages,
        books,
    });
}));
exports.default = router;
