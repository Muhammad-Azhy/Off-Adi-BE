import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../middlewere';
import { FavBookMiddlewere } from './FavBookDTO';
const prisma = new PrismaClient();
const router = express.Router();


router.post("/FavBook/:BookID", verifyToken, FavBookMiddlewere , async (req,res)=>{
    const decodedToken = (req as any).decodedToken;
    const ID = decodedToken.ID;
    const BookID = req.params.BookID;
    console.log(BookID);
    
    let id :number;
    let favBooks = await prisma.favBooks.findFirst({where:{
        ListenerID:+ID
    }})
    if(!favBooks){
        console.log("DOESN'T HAVE IT BOOOO");

     await prisma.favBooks.create({
    data:{
        BookID:+BookID,
        ListenerID:+ID,
        Books:{
            connect:{ID:+BookID}
        }
    }
    }).then( async x =>{
        await prisma.favBooks.update({where:{ID:x.ID}, data:{
            Books:{connect:{ID:+BookID}}
        }}).then(y=>{return res.send("Book "+BookID+" Added")})
    });
    }
    else{
          await prisma.favBooks.update({where:{ID:favBooks.ID} , data:{
        Books:{connect:{ID:+BookID}}
    }}).then(x =>{
        return res.send(x)
    })
    }
})  

router.delete("/FavBook/:BookID" , verifyToken, async (req,res)=>{
    try{

        const decodedToken = (req as any).decodedToken;
     const ID = decodedToken.ID;
     let id:number;
    const BookID = req.params.BookID;
    let favBooks = await prisma.favBooks.findFirst({where:{
        ListenerID:+ID
    }})
    if(!favBooks){
        console.log("DOESN'T HAVE IT BOOOO");
        
    await prisma.favBooks.create({
    data:{
        BookID:+BookID,
        ListenerID:+ID,
        Books:{
            connect:{ID:+BookID}
        }
    }
    }).then(async x =>{
        await prisma.favBooks.update({where:{ID:+BookID,ListenerID:ID} , data:{
        Books:{disconnect:{ID:+BookID}}
    }}).then(y =>{
        return res.send("Removed "+BookID+" from fav")
    })
    })

    }
    
    await prisma.favBooks.update({where:{ID:favBooks.ID,ListenerID:ID} , data:{
        Books:{disconnect:{ID:+BookID}}
    }}).then(x =>{
        return res.send("Removed "+BookID+" from fav")
    })
        
    }catch(e){console.log(e);
     res.send("Error removing book ")}
     
})

router.get("/FavBook" , verifyToken,async (req,res)=>{
    const decodedToken = (req as any).decodedToken;
    const ID = decodedToken.ID;
    const listener = await prisma.listeners.findFirst({where:{ID:+ID}})
    if(!listener){
        return res.send("Id not valid user not found...")
    }
    let favBooks = await prisma.favBooks.findFirst({where:{ListenerID:+ID}})
    if(!favBooks)
        return res.send("You have no fav books...")
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const booksPerPage = parseInt(req.query.limit as string, 10); 
    const books = await prisma.favBooks.findFirst({where:{ID:favBooks.ID}, select:{
        Books:{select:
            {ID:true,
            Author: { select: { AuthorFullName: true, ID: true } },
            Title: true,
            Summary:true,
            Narrator: true,
            Files:{select:{Cover:true , Demo:true ,Audio:true}},
            ListningTime:{where:{
                ListenerID:listener.ID
            }, }},
    skip: (page - 1) * booksPerPage,
    take: booksPerPage 
    }
}})
   return res.send(books);
});


export default router;