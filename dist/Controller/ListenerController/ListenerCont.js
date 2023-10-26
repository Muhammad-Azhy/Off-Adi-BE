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
const ListenerDTO_1 = require("./ListenerDTO");
const middlewere_1 = require("../../middlewere");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/SignUp", ListenerDTO_1.SignInMiddlewere, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Username, Password, Email, UserFullName, Phone } = req.body;
    yield prisma.listeners.create({ data: {
            UserFullName,
            Password,
            Phone,
            Email,
            Username,
        } }).then(x => {
        res.send(x);
    });
}));
router.post("/Login", ListenerDTO_1.LoginMiddlewere, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Username, Password } = req.body;
    yield prisma.listeners.findFirst({ where: {
            Username,
            Password
        } }).then((x) => __awaiter(void 0, void 0, void 0, function* () {
        const ID = x.ID;
        const token = jsonwebtoken_1.default.sign({ ID: x.ID }, "jdbvudfge"); //env not working??
        res.json({
            ID,
            Username,
            token,
        });
    }));
}));
router.put("/Listeners/:ID", middlewere_1.verifyToken, ListenerDTO_1.UpdateProfileMiddlewere, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.ID;
    const { UserFullName, Email, Phone } = req.body;
    const listener = yield prisma.listeners.findFirst({ where: {
            ID: +ID
        } });
    if (!listener)
        return res.send("listener not found...");
    yield prisma.listeners.update({
        where: { ID: +ID },
        data: { UserFullName, Email, Phone }
    }).then(x => {
        return res.send(x);
    });
}));
router.delete('/Listeners/:ID', middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.ID;
    const listener = yield prisma.listeners.findFirst({ where: {
            ID: +ID
        } });
    if (!listener)
        return res.send("listener not found...");
    yield prisma.listeners.delete({
        where: { ID: +ID },
    });
}));
router.get("/Listeners/:ID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.ID;
    const listener = yield prisma.listeners.findFirst({ where: {
            ID: +ID
        } });
    if (!listener) {
        return res.send("Listener Not Found...");
    }
}));
router.get("/Listeners", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listenersPerPage = parseInt(req.query.limit, 10);
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const pageNumber = isNaN(page) || page < 1 ? 1 : page;
        const maxListeners = yield prisma.listeners.count();
        const maxPages = Math.ceil(maxListeners / listenersPerPage);
        const listeners = yield prisma.listeners.findMany({
            skip: (pageNumber - 1) * listenersPerPage,
            take: listenersPerPage,
            select: {
                ID: true,
                UserFullName: true,
                Email: true,
                Phone: true
            },
        });
        res.send({
            page: pageNumber,
            maxPages,
            listeners,
        });
    }
    catch (err) {
        console.error("Error getting listeners:", err);
        return res.status(500).send("Error getting listeners...");
    }
}));
exports.default = router;
