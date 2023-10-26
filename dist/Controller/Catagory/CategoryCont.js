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
router.post("/Category", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Name = req.body.Name;
    if (!Name)
        return res.send("Missing Name");
    Name[0].toUpperCase;
    const exist = yield prisma.category.findFirst({ where: {
            Name
        } });
    if (exist)
        return res.send("Category already exists");
    yield prisma.category.create({ data: {
            Name
        } }).then(x => {
        return res.send(x);
    });
}));
router.get("/Category", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.category.findMany().then(x => {
        return res.send(x);
    });
}));
router.get("/Category/:ID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.ID;
    const category = yield prisma.category.findFirst({ where: { ID: +ID } }).then(x => {
        return res.send(x);
    });
    if (!category)
        return res.send("Category Not Found...");
}));
router.delete("/Category/:ID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.ID;
    const category = yield prisma.category.findFirst({ where: { ID: +ID } });
    if (!category)
        return res.send("Category Not Found...");
    yield prisma.category.delete({ where: {
            ID: +ID
        } });
    res.send("Deleted...");
}));
router.put("/Category/:ID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.ID;
    const Name = req.body.Name;
    if (!Name)
        return res.send("Missing Name");
    Name[0].toUpperCase;
    const exist = yield prisma.category.findFirst({ where: {
            ID: +ID
        } });
    if (!exist)
        return res.send("Category doesn't exist");
    yield prisma.category.update({ where: { ID: +ID }, data: { Name } });
    yield prisma.category.findMany().then(x => {
        res.send(x);
    });
}));
exports.default = router;
