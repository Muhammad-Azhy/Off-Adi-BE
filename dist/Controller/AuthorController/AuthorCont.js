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
const AuthorDTO_1 = require("./AuthorDTO");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/Author", middlewere_1.verifyToken, AuthorDTO_1.CreateAuthorMiddlewere, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { AuthorFullName, Email, Phone } = req.body;
    const authorExists = yield prisma.author.findFirst({ where: { AuthorFullName, Phone } });
    if (authorExists)
        return res.send("Author with that name already exists");
    yield prisma.author.create({
        data: {
            AuthorFullName,
            Email,
            Phone,
        }
    }).then(x => {
        return res.send(x);
    });
}));
router.put("/Author/:AuthorID", middlewere_1.verifyToken, AuthorDTO_1.UpdateAuthorMiddlewere, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.AuthorID;
    const { AuthorFullName, Email, Phone } = req.body;
    const authorExists = yield prisma.author.findFirst({
        where: {
            ID: +ID
        }
    });
    if (!authorExists)
        return res.send("Author doen't exist");
    yield prisma.author.update({
        where: { ID: +ID },
        data: {
            AuthorFullName,
            Email,
            Phone,
        },
    }).then((x) => __awaiter(void 0, void 0, void 0, function* () {
        const authors = yield prisma.author.findMany();
        return res.send(authors);
    }));
}));
router.delete("/Author/:AuthorID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.decodedToken;
    const ID = req.params.AuthorID;
    const author = yield prisma.author.findFirst({ where: {
            ID: +ID
        } });
    if (!author)
        return res.send("Author not found...");
    yield prisma.author.delete({ where: {
            ID: +ID
        } }).then(x => {
        return res.send("Author Deleted...");
    });
}));
router.get("/Author/:AuthorID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.AuthorID;
    const author = yield prisma.author.findFirst({ where: {
            ID: +ID
        } });
    if (!author) {
        return res.send("Auhtor Not Found...");
    }
    return res.send(author);
}));
router.get("/Author", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorPerPage = parseInt(req.query.limit, 10);
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const pageNumber = isNaN(page) || page < 1 ? 1 : page;
        const maxAuthors = yield prisma.author.count();
        const maxPages = Math.ceil(maxAuthors / authorPerPage);
        const authors = yield prisma.author.findMany({
            skip: (pageNumber - 1) * authorPerPage,
            take: authorPerPage,
            select: {
                ID: true,
                AuthorFullName: true,
                Email: true,
                Phone: true
            },
        });
        res.send({
            page: pageNumber,
            maxPages,
            authors,
        });
    }
    catch (err) {
        console.error("Error getting authors:", err);
        return res.status(500).send("Error getting authors...");
    }
}));
exports.default = router;
