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
const PublisherDto_1 = require("./PublisherDto");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/Publisher", middlewere_1.verifyToken, PublisherDto_1.CreatePublisherMiddlewere, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { PublisherName, Email, Phone, Website } = req.body;
        const publisherExists = yield prisma.publisher.findFirst({
            where: {
                Email,
                Phone,
                Website,
            }
        });
        if (publisherExists)
            return res.send('Publisher already exists');
        yield prisma.publisher.create({
            data: {
                PublisherName,
                Email,
                Phone,
                Website
            }
        }).then(x => {
            return res.send(x);
        });
    }
    catch (error) {
        console.log(error);
        return res.send("Error while making a publisher...");
    }
}));
router.put("/Publisher/:ID", middlewere_1.verifyToken, PublisherDto_1.UpdatePublisherMiddlewere, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.ID;
    const { PublisherName, Email, Phone, Website } = req.body;
    const publisherExists = yield prisma.publisher.findFirst({
        where: {
            ID: +ID
        }
    });
    if (!publisherExists) {
        return res.send("Publisher doen't exist");
    }
    yield prisma.publisher.update({
        where: { ID: +ID },
        data: {
            PublisherName,
            Email,
            Phone,
            Website
        }
    }).then(x => {
        return res.send(x);
    });
}));
router.delete("/Publisher/:ID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.ID;
    const publisher = yield prisma.publisher.findFirst({ where: {
            ID: +ID
        } });
    if (!publisher)
        return res.send("Publisher not found...");
    yield prisma.publisher.delete({ where: {
            ID: +ID
        } }).then(x => {
        return res.send(x);
    });
}));
router.get("/Publisher/:ID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.ID;
    const publisher = yield prisma.publisher.findFirst({ where: {
            ID: +ID
        } });
    if (!publisher) {
        return res.send("Publisher Not Found...");
    }
    return res.send(publisher);
}));
router.get("/Publisher", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publishersPerPage = parseInt(req.query.limit, 10);
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const pageNumber = isNaN(page) || page < 1 ? 1 : page;
        const maxPublishers = yield prisma.listeners.count();
        const maxPages = Math.ceil(maxPublishers / publishersPerPage);
        const publishers = yield prisma.publisher.findMany({
            skip: (pageNumber - 1) * publishersPerPage,
            take: publishersPerPage,
            select: {
                ID: true,
                PublisherName: true,
                Email: true,
                Phone: true,
                Website: true
            },
        });
        res.send({
            page: pageNumber,
            maxPages,
            publishers,
        });
    }
    catch (err) {
        console.log("Error getting Publishers:", err);
        return res.status(500).send("Error getting Publishers...");
    }
}));
exports.default = router;
