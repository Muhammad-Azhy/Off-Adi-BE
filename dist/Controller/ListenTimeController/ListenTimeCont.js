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
router.post("/ListenTime/:BookID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const BookID = req.params.BookID;
    const decodedToken = req.decodedToken;
    const myID = decodedToken.ID;
    const { Time, Finished } = req.body;
    Time.toString();
    let ListenTime = yield prisma.listningTime.findFirst({ where: {
            BookID: +BookID,
            ListenerID: myID
        } });
    if (!ListenTime) {
        yield prisma.listningTime.create({
            data: {
                ListenerID: myID,
                BookID: +BookID,
                Time,
                Finished
            }
        }).then(x => {
            res.send(x);
        });
    }
    yield prisma.listningTime.update({
        where: {
            ID: ListenTime.ID
        },
        data: {
            Time,
            Finished
        }
    }).then(x => {
        res.send(x);
    });
}));
router.get("/ListenTime/:BookID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const BookID = req.params.BookID;
    const decodedToken = req.decodedToken;
    const myID = decodedToken.ID;
    let ListenTime = yield prisma.listningTime.findFirst({ where: {
            BookID: +BookID,
            ListenerID: myID
        } });
    if (!ListenTime)
        return res.send("You have no time on this book");
    return res.send([ListenTime]);
}));
exports.default = router;
