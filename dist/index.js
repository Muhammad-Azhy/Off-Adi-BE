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
exports.uploader = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const ListenerCont_1 = __importDefault(require("./Controller/ListenerController/ListenerCont"));
const PublisherCont_1 = __importDefault(require("./Controller/PublisherController/PublisherCont"));
const AuthorCont_1 = __importDefault(require("./Controller/AuthorController/AuthorCont"));
const BookCont_1 = __importDefault(require("./Controller/BookController/BookCont"));
const BookRatingCont_1 = __importDefault(require("./Controller/BookRateController/BookRatingCont"));
const FavBookCont_1 = __importDefault(require("./Controller/FavBooksController/FavBookCont"));
const LibraryCont_1 = __importDefault(require("./Controller/LibraryController/LibraryCont"));
const CartCont_1 = __importDefault(require("./Controller/CartController/CartCont"));
const CategoryCont_1 = __importDefault(require("./Controller/Catagory/CategoryCont"));
const ListenTimeCont_1 = __importDefault(require("./Controller/ListenTimeController/ListenTimeCont"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const middlewere_1 = require("./middlewere");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
//http://localhost:3001/Media/${file.originalname}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/Media', express_1.default.static('./Media'));
app.use("/", ListenerCont_1.default);
app.use("/", PublisherCont_1.default);
app.use("/", AuthorCont_1.default);
app.use("/", BookCont_1.default);
app.use("/", BookRatingCont_1.default);
app.use("/", FavBookCont_1.default);
app.use("/", LibraryCont_1.default);
app.use("/", ListenTimeCont_1.default);
app.use("/", CartCont_1.default);
app.use("/", CategoryCont_1.default);
const server = http_1.default.createServer(app);
const PORT = 3001;
const fileStorageEngine = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./Media");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
exports.uploader = (0, multer_1.default)({ storage: fileStorageEngine }).fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
    { name: 'demo', maxCount: 1 }
]);
app.get("/GetAll", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield prisma.books.findMany({
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
    const authors = yield prisma.author.findMany({
        select: {
            ID: true,
            AuthorFullName: true,
            Email: true,
            Phone: true
        },
    });
    const categories = yield prisma.category.findMany();
    const publishers = yield prisma.publisher.findMany({
        select: {
            ID: true,
            PublisherName: true,
            Email: true,
            Phone: true,
            Website: true
        },
    });
    return res.send({
        Books: books,
        Categories: categories,
        Authors: authors,
        Publishers: publishers
    });
}));
server.listen(PORT, () => {
    console.log("SERVER RUNNING ON PORT 3001");
});
