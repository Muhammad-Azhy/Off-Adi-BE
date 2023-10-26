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
exports.UpdateProfileMiddlewere = exports.LoginMiddlewere = exports.SignInMiddlewere = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SignUp {
}
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(1, 50, { message: 'Username should not be empty' }),
    __metadata("design:type", String)
], SignUp.prototype, "Username", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(6, 50, { message: 'Password should not be empty or too short' }),
    __metadata("design:type", String)
], SignUp.prototype, "Password", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(1, 50, { message: 'UserFullName should not be empty' }),
    __metadata("design:type", String)
], SignUp.prototype, "UserFullName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.Length)(1, 50, { message: 'Email should not be empty' }),
    __metadata("design:type", String)
], SignUp.prototype, "Email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Matches)(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: 'Invalid phone number' }),
    __metadata("design:type", String)
], SignUp.prototype, "Phone", void 0);
class Login {
}
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(1, 50, { message: 'Username should not be empty' }),
    __metadata("design:type", String)
], Login.prototype, "Username", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(6, 50, { message: 'Password should not be empty or too short' }),
    __metadata("design:type", String)
], Login.prototype, "Password", void 0);
class UpdateProfile {
}
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Length)(1, 50, { message: 'Username should not be empty' }),
    __metadata("design:type", String)
], UpdateProfile.prototype, "UserFullName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.Length)(1, 50, { message: 'Email should not be empty' }),
    __metadata("design:type", String)
], UpdateProfile.prototype, "Email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Must be a vaild type (String,Int,...)" }),
    (0, class_validator_1.Matches)(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: 'Invalid phone number' }),
    __metadata("design:type", String)
], UpdateProfile.prototype, "Phone", void 0);
function SignInMiddlewere(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const SignUpDto = (0, class_transformer_1.plainToClass)(SignUp, req.body);
        const errors = yield (0, class_validator_1.validate)(SignUpDto);
        if (errors.length > 0) {
            return res.status(400).json({ errors: errors.map(error => error.constraints) });
        }
        const user = yield prisma.listeners.findFirst({ where: {
                Username: SignUpDto.Username
            } });
        if (user) {
            return res.send("Someone with that Username already exists...");
        }
        next();
    });
}
exports.SignInMiddlewere = SignInMiddlewere;
function LoginMiddlewere(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const LoginDto = (0, class_transformer_1.plainToClass)(Login, req.body);
        const errors = yield (0, class_validator_1.validate)(LoginDto);
        if (errors.length > 0) {
            return res.status(400).json({ errors: errors.map(error => error.constraints) });
        }
        const user = yield prisma.listeners.findFirst({ where: {
                Username: LoginDto.Username,
                Password: LoginDto.Password
            } });
        if (!user) {
            return res.send("User not found...");
        }
        next();
    });
}
exports.LoginMiddlewere = LoginMiddlewere;
function UpdateProfileMiddlewere(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const UpdateDto = (0, class_transformer_1.plainToClass)(UpdateProfile, req.body);
        const errors = yield (0, class_validator_1.validate)(UpdateDto);
        if (errors.length > 0) {
            return res.status(400).json({ errors: errors.map(error => error.constraints) });
        }
        next();
    });
}
exports.UpdateProfileMiddlewere = UpdateProfileMiddlewere;
