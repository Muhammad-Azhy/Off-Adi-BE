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
exports.UpdateAuthorMiddlewere = exports.CreateAuthorMiddlewere = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class NewAuthor {
}
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(1, 50, { message: 'Author Full Name should not be empty' }),
    __metadata("design:type", String)
], NewAuthor.prototype, "AuthorFullName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.Length)(1, 50, { message: 'Email should not be empty' }),
    __metadata("design:type", String)
], NewAuthor.prototype, "Email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Matches)(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: 'Invalid phone number' }),
    __metadata("design:type", String)
], NewAuthor.prototype, "Phone", void 0);
class UpdateAuthor {
}
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(1, 50, { message: 'Author Full Name should not be empty' }),
    __metadata("design:type", String)
], UpdateAuthor.prototype, "AuthorFullName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.Length)(1, 50, { message: 'Email should not be empty' }),
    __metadata("design:type", String)
], UpdateAuthor.prototype, "Email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Matches)(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: 'Invalid phone number' }),
    __metadata("design:type", String)
], UpdateAuthor.prototype, "Phone", void 0);
function CreateAuthorMiddlewere(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const AuthorDto = (0, class_transformer_1.plainToClass)(NewAuthor, req.body);
        const errors = yield (0, class_validator_1.validate)(AuthorDto);
        if (errors.length > 0) {
            return res.status(400).json({ errors: errors.map(error => error.constraints) });
        }
        next();
    });
}
exports.CreateAuthorMiddlewere = CreateAuthorMiddlewere;
function UpdateAuthorMiddlewere(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const UpdateAuthorDto = (0, class_transformer_1.plainToClass)(UpdateAuthor, req.body);
        const errors = yield (0, class_validator_1.validate)(UpdateAuthorDto);
        if (errors.length > 0) {
            return res.status(400).json({ errors: errors.map(error => error.constraints) });
        }
        next();
    });
}
exports.UpdateAuthorMiddlewere = UpdateAuthorMiddlewere;
