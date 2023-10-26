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
const BookRatingDTO_1 = require("./BookRatingDTO");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/BookRating/:BookID", middlewere_1.verifyToken, BookRatingDTO_1.BookRatingMiddlewere, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Rating, Review } = req.body;
    const decodedToken = req.decodedToken;
    const ID = decodedToken.ID;
    const BookID = req.params.BookID;
    const book = yield prisma.books.findFirst({ where: {
            ID: +BookID
        } });
    const listener = yield prisma.listeners.findFirst({ where: { ID: +ID } });
    yield prisma.bookRating.create({
        data: {
            Book: { connect: {
                    ID: book.ID
                } },
            Reader: {
                connect: {
                    ID: listener.ID
                }
            },
            Rating,
            Review,
            RatingDate: new Date(),
        }
    });
}));
router.put("/BookRating/:BookID/:RatingID", middlewere_1.verifyToken, BookRatingDTO_1.UpdateBookRatingMiddlewere, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.decodedToken;
    const MyID = decodedToken.ID;
    const ID = req.params.RatingID; //Rating ID
    const { Rating, Review } = req.body;
    const YourRating = yield prisma.bookRating.findFirst({ where: {
            ReaderID: MyID,
            ID: +ID
        } });
    if (!YourRating)
        return res.send("Not Your Rating...");
    yield prisma.bookRating.update({ where: { ReaderID: MyID, ID: +ID },
        data: {
            Rating,
            Review
        }
    });
}));
router.delete("/BookRating/:BookID/:RatingID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.decodedToken;
    const MyID = decodedToken.ID;
    const RatingID = req.params.RatingID; //Rating ID
    const BookID = req.params.BookID;
    const YourRating = yield prisma.bookRating.findFirst({ where: {
            ReaderID: MyID,
            ID: +RatingID
        } });
    if (!YourRating)
        return res.send("Not Your Rating...");
    yield prisma.bookRating.delete({ where: { ReaderID: MyID, ID: +RatingID } });
    yield prisma.books.update({ where: { ID: +BookID }, data: {
            BookRatings: { disconnect: { ID: +RatingID } }
        } });
    return res.send("Rating Deleted");
}));
router.get("/BookRating/:BookID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const BookID = req.params.BookID;
        const RatingPerPage = parseInt(req.query.limit, 10);
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const pageNumber = isNaN(page) || page < 1 ? 1 : page;
        const maxRatings = yield prisma.bookRating.count({ where: {
                BookID: +BookID
            } });
        const maxPages = Math.ceil(maxRatings / RatingPerPage);
        const ratings = yield prisma.bookRating.findMany({
            where: { BookID: +BookID },
            skip: (pageNumber - 1) * RatingPerPage,
            take: RatingPerPage,
            select: {
                ID: true,
                Review: true,
                Rating: true,
                Reader: { select: { UserFullName: true } },
                Book: { select: { Title: true } }
            },
        });
        res.send({
            page: pageNumber,
            maxPages,
            ratings,
        });
    }
    catch (err) {
        console.error("Error getting Ratings:", err);
        return res.status(500).send("Error getting Ratings...");
    }
}));
router.get("BookRating/:RatingID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ID = req.params.ID;
        const rating = yield prisma.bookRating.findFirst({
            where: { ID: +ID },
        });
        return res.send(rating);
    }
    catch (err) {
        console.error("Error getting rating:", err);
        return res.status(500).send("Error getting rating...");
    }
}));
exports.default = router;
