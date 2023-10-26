import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../middlewere';
const prisma = new PrismaClient();
const router = express.Router();

router.delete("/Library/:BookID", verifyToken ,async (req , res) => {
    const BookID = req.params.BookID
    const decodedToken = (req as any).decodedToken;
     const ID = decodedToken.ID;
    const listener = await prisma.listeners.findFirst({where:{ID:+ID}})
    if(!listener){
        return res.send("Id not valid user not found...")
    }
    const book = await prisma.books.findFirst({where:{ID:+BookID}});
    if(!book)
        return res.send("Book not found...")
    let library = await prisma.library.findFirst({where:{ListenerID:+ID}})
    if(!library)
    {
        return res.send("No book to delete")
    }
        
    await prisma.library.update({where:{ID:library.ID},data:{
        book:{
            disconnect:{
                ID:+BookID
            }
        }
    }}).then(x=>{
        return res.send(x)
    })
})

router.get("/Library", verifyToken , async (req,res)=>{
    const decodedToken = (req as any).decodedToken;
    const ID = decodedToken.ID;
    const listener = await prisma.listeners.findFirst({where:{ID:+ID}})
    if(!listener){
        return res.send("Id not valid user not found...")
    }
    let library = await prisma.library.findFirst({where:{ListenerID:+ID}})
    if(!library){
        await prisma.library.create({data:{ListenerID:ID}})
        return res.send("You have no books...")
    }
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const booksPerPage = parseInt(req.query.limit as string, 10); 
    const books = await prisma.books.findMany({
    where:{libraries:{every:{ListenerID:listener.ID}}},
    select: {
        ID: true,
        Author: { select: { AuthorFullName: true, ID: true } },
        Title: true,
        Narrator: true,
        Files:{select:{Cover:true , Demo:true ,Audio:true}},
        listenTime:{
            select:{
                ID:true,
                Time:true,
                Finished:true,
                BookID:true
            }
        }
    },
    skip: (page - 1) * booksPerPage,
    take: booksPerPage
});

return res.send(books);

})

router.get("/Library/:BookID", verifyToken ,async (req,res) => {
    const ID = req.params.BookID;
    const listener = await prisma.listeners.findFirst({where:{ID:+ID}})
    if(!listener){
        return res.send("Id not valid user not found...")
    }
    let library = await prisma.library.findFirst({where:{ListenerID:+ID}})
    if(!library)
        return res.send("You have no books...")
    const books = await prisma.books.findMany({
    where:{libraries:{every:{ListenerID:listener.ID}}},
    select: {
        ID: true,
        Author: { select: { AuthorFullName: true, ID: true } },
        Title: true,
        Narrator: true,
        Files:{select:{Cover:true , Demo:true ,Audio:true}},
        Summary:true
    },
    }).then(x=>{
        res.send(x)
    })
})
export default router