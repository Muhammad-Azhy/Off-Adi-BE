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
exports.UpdateBookMiddlewere = exports.CreateBookMiddlewere = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class NewBook {
}
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(1, 50, { message: 'PublisherName should not be empty' }),
    __metadata("design:type", String)
], NewBook.prototype, "PublisherName", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(1, 50, { message: 'Title should not be empty' }),
    __metadata("design:type", String)
], NewBook.prototype, "Title", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(1, 50, { message: 'Authors full name should not be empty' }),
    __metadata("design:type", String)
], NewBook.prototype, "AuthorFullName", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(1, 50, { message: 'Narrator should not be empty' }) // Specify a custom message for the validation
    ,
    __metadata("design:type", String)
], NewBook.prototype, "Narrator", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NewBook.prototype, "Language", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(1, 250, { message: 'Summary is needed' }),
    __metadata("design:type", String)
], NewBook.prototype, "Summary", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 250, { message: ' Categories are needed' }),
    __metadata("design:type", String)
], NewBook.prototype, "Category", void 0);
class UpdateBook {
}
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(1, 50, { message: 'Narrator should not be empty' }) // Specify a custom message for the validation
    ,
    __metadata("design:type", String)
], UpdateBook.prototype, "Narrator", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(1, 250, { message: 'Summary is needed' }),
    __metadata("design:type", String)
], UpdateBook.prototype, "Summary", void 0);
function CreateBookMiddlewere(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const BookDto = (0, class_transformer_1.plainToClass)(NewBook, req.body);
        const DtoErrors = yield (0, class_validator_1.validate)(BookDto);
        if (DtoErrors.length > 0) {
            return res.status(400).json({ errors: DtoErrors.map(error => error.constraints) });
        }
        const { PublisherName, AuthorFullName, NumberOfPages, Category } = req.body;
        if (isNaN(NumberOfPages) || !NumberOfPages) {
            return res.send("Number of pages is invalid");
        }
        const publisher = yield prisma.publisher.findFirst({ where: {
                PublisherName
            } });
        if (!publisher) {
            return res.send("Publisher Not Found...");
        }
        const Author = yield prisma.author.findFirst({ where: {
                AuthorFullName
            } });
        if (!Author) {
            return res.send("Author Not Found...");
        }
        const Categories = yield prisma.category.findFirst({ where: {
                Name: Category
            } });
        if (!Categories) {
            return res.send("No Category found with that name");
        }
        next();
    });
}
exports.CreateBookMiddlewere = CreateBookMiddlewere;
function UpdateBookMiddlewere(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const BookDto = (0, class_transformer_1.plainToClass)(UpdateBook, req.body);
        const DtoErrors = yield (0, class_validator_1.validate)(BookDto);
        if (DtoErrors.length > 0) {
            return res.status(400).json({ errors: DtoErrors.map(error => error.constraints) });
        }
        next();
    });
}
exports.UpdateBookMiddlewere = UpdateBookMiddlewere;
