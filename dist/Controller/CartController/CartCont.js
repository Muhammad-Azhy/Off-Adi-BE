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
router.get("/Cart/:ID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const myID = req.params.ID;
    if (!myID) {
        return res.send("Your ID is missing...");
    }
    const cart = yield prisma.cart.findFirst({
        where: {
            UserID: +myID
        },
        select: {
            books: {
                select: {
                    ID: true,
                    Title: true,
                    Author: true,
                    Summary: true,
                    NumberOfPages: true,
                    Files: {
                        select: {
                            Cover: true
                        }
                    }
                }
            }
        }
    });
    if (!cart) {
        return res.send("No books in Cart");
    }
    return res.send(cart);
}));
router.put("/Cart/:BookID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const BookID = req.params.BookID;
        const decodedToken = req.decodedToken;
        const myID = decodedToken.ID;
        let userCart = yield prisma.cart.findFirst({
            where: {
                UserID: +myID,
            },
        });
        if (!userCart) {
            userCart = yield prisma.cart.create({
                data: {
                    UserID: +myID
                }
            });
        }
        ;
        const addedBook = yield prisma.cart.update({
            where: {
                ID: +userCart.ID
            },
            data: {
                books: {
                    connect: {
                        ID: +BookID,
                    },
                },
            },
            select: {
                books: true, // Optionally select the books in the cart after adding the new book.
            },
        });
        res.send(addedBook.books);
    }
    catch (err) {
        console.log(err);
    }
}));
router.delete("/Cart/:BookID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const BookID = req.params.BookID;
    const decodedToken = req.decodedToken;
    const myID = decodedToken.ID;
    let userCart = yield prisma.cart.findFirst({
        where: {
            UserID: +myID,
        },
    });
    if (!userCart) {
        userCart = yield prisma.cart.create({
            data: {
                UserID: myID
            }
        });
    }
    yield prisma.cart.update({
        where: { ID: userCart.ID },
        data: {
            books: {
                disconnect: {
                    ID: +BookID
                }
            }
        }
    }).then(x => {
        return res.send("Book Removed. . .");
    });
}));
router.post("/Cart/:BookID", middlewere_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const BookID = req.params.BookID;
    const decodedToken = req.decodedToken;
    const ID = decodedToken.ID;
    const listener = yield prisma.listeners.findFirst({ where: { ID: +ID } });
    if (!listener) {
        return res.send("Id not valid user not found...");
    }
    const book = yield prisma.books.findFirst({ where: { ID: +BookID } });
    if (!book)
        return res.send("Book not found...");
    let library = yield prisma.library.findFirst({ where: { ListenerID: +ID } });
    if (!library) {
        console.log("Library created");
        library = yield prisma.library.create({ data: { ListenerID: listener.ID } });
    }
    yield prisma.library.update({
        where: { ID: library.ID },
        data: { book: { connect: { ID: +BookID } } }
    });
    yield prisma.cart.update({ where: {
            UserID: ID
        }, data: {
            books: { disconnect: { ID: +BookID } }
        } });
    console.log("Bought " + book.Title);
    yield prisma.listningTime.create({
        data: {
            ListenerID: listener.ID,
            BookID: +BookID,
            Time: "0:00",
            Finished: false
        }
    });
    res.send("Bought " + book.Title);
}));
// router.post("/Cart", verifyToken , async (req,res)=>{
//     const BookIDs = req.body.BookIDs;
//     const decodedToken = (req as any).decodedToken;
//     const ID = decodedToken.ID;
//     const listener = await prisma.listeners.findFirst({where:{ID:+ID}})
//     if(!listener){
//         return res.send("Id not valid user not found...")
//     }
//     let library = await prisma.library.findFirst({where:{ListenerID:+ID}})
//     if(!library){
//        library = await prisma.library.create({data:{ListenerID:listener.ID }})
//     }
//     BookIDs.map( async ID =>{
//         const book = await prisma.books.findFirst({where:{ID:ID}});
//     if(!book)
//         return res.send("Book not found...")
//     await prisma.library.update({
//         where:{ID:library.ID},
//         data:{book:{connect:{ID:+ID}}}
//     })
//     })
// }
exports.default = router;
