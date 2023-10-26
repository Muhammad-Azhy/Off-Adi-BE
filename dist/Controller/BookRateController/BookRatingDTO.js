"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.UpdateBookRatingMiddlewere = exports.BookRatingMiddlewere = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class BookRatingDto {
}
__decorate([
    (0, class_validator_1.IsInt)({ message: 'BookID must be an integer' }),
    (0, class_validator_1.Min)(1, { message: 'BookID should be at least 1' }),
    __metadata("design:type", Number)
], BookRatingDto.prototype, "BookID", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'Rating must be an integer' }),
    (0, class_validator_1.Min)(1, { message: 'Rating should be at least 1' }),
    (0, class_validator_1.Max)(5, { message: 'Rating cannot be more than 5' }),
    __metadata("design:type", Number)
], BookRatingDto.prototype, "Rating", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Review should not be empty' }),
    (0, class_validator_1.Length)(1, 250, { message: 'Review length should be between 1 and 250 characters' }),
    __metadata("design:type", String)
], BookRatingDto.prototype, "Review", void 0);
function BookRatingMiddlewere(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationObject = (0, class_transformer_1.plainToClass)(BookRatingDto, req.body);
        const errors = yield (0, class_validator_1.validate)(validationObject);
        const ID = req.params.ID;
        if (errors.length > 0) {
            return res.status(400).json({ errors: errors.map((error) => error.constraints) });
        }
        const book = yield prisma.books.findFirst({ where: { ID: +validationObject.BookID } });
        if (!book) {
            return res.send("Book doesn't exist...");
        }
        const listener = yield prisma.listeners.findFirst({ where: { ID: +ID } });
        if (!listener) {
            return res.send('Listener not found...');
        }
    });
}
exports.BookRatingMiddlewere = BookRatingMiddlewere;
function UpdateBookRatingMiddlewere(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationObject = (0, class_transformer_1.plainToClass)(BookRatingDto, req.body);
        const errors = yield (0, class_validator_1.validate)(validationObject);
        const ID = req.params.RatingID;
        if (errors.length > 0) {
            return res.status(400).json({ errors: errors.map((error) => error.constraints) });
        }
        const book = yield prisma.books.findFirst({ where: { ID: +validationObject.BookID } });
        if (!book) {
            return res.send("Book doesn't exist...");
        }
        const Rating = yield prisma.bookRating.findFirst({ where: { ID: +ID } });
        if (!Rating) {
            return res.send('Rating not found...');
        }
    });
}
exports.UpdateBookRatingMiddlewere = UpdateBookRatingMiddlewere;
