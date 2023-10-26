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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavBookMiddlewere = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function FavBookMiddlewere(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const BookID = req.params.BookID;
        const ID = req.params.ID;
        if (!BookID || !ID)
            return res.send("Missing URL parameters");
        const book = yield prisma.books.findFirst({ where: { ID: +BookID } });
        if (!book)
            return res.send("Book doesn't exist...");
        const listener = yield prisma.listeners.findFirst({ where: { ID: +ID } });
        if (!listener)
            return res.send('Listener not found...');
        next();
    });
}
exports.FavBookMiddlewere = FavBookMiddlewere;
