import express, { Express, Request, Response, response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../middlewere';
import { CreateBookMiddlewere, UpdateBookMiddlewere } from './BookDTO';
import { uploader } from '../..'
import path, { parse } from 'path';
import { fileURLToPath } from 'url';
const prisma = new PrismaClient();
const router = express.Router();
router.use(express.json())

router.use("/Media", express.static(path.join(__dirname, "Media")));
router.post("/Books",verifyToken,CreateBookMiddlewere,async (req,res)=>{
  console.log("HI");
  
  const decodedToken = (req as any).decodedToken;
  const ID = decodedToken.ID;
  const {
  PublisherName,
  Title,
  Narrator,
  NumberOfPages,
  Language,
  Category,
  Summary
} = req.body;

const publisher = await prisma.publisher.findFirst({
  where: {
    PublisherName
  }
})

const author = await prisma.author.findFirst({
  where: {
    ID
  }
});
    const book = await prisma.books.create({ //add the audio demo and cover here 
      data: {
        Categories:{
          connect:{
            Name:Category
          }
        },
        Publisher: {
          connect: {
            ID: publisher.ID
          }
        },
        Author: {
          connect: {
            ID: author.ID
          }
        },
        Title,
        Narrator,
        NumberOfPages:+NumberOfPages,
        Language:+Language,
        Summary,
      }
    });
  
res.send(book)
}) 

router.post("/Files/:BookID", verifyToken , async(req,res)=>{
  try{
    const BookID =req.params.BookID;
    const decodedToken = (req as any).decodedToken
    const ID = decodedToken.ID;
    uploader(req, res, async (err) => {
      
    if (err) {
      return res.status(500).send('Error uploading files.');
    }
    
    
    
    const audioFile = req.files['audio'][0];
    const coverFile = req.files['cover'][0];
    const demoFile = req.files['demo'][0];
    
    if (!audioFile ||  !coverFile || !demoFile) {
       return res.status(402).send(`missing files...`);
    }
    let book = await prisma.books.findFirst({where:{
        ID:+BookID
    }})
    if(!book)
      return res.send("Book is not yours or not found")
    await prisma.files.create({
      data:{
        BookID:book.ID,
         Cover: `Media/${coverFile.originalname}`,
         Demo: `Media/${demoFile.originalname}`,
         Audio: `Media/${audioFile.originalname}`,
      }
    }).then(async x=>{
      
      
      await prisma.books.update({where:{ID:+BookID}, data:{
        Files:{connect:{ID:x.ID}}
      }})
    })
    await prisma.books.findFirst({where:{ID:+BookID},select:{
      ID:true,
      Author:true,
      Title:true,
      Summary:true,
      Publisher:true,
      NumberOfPages:true,
      Files:true,
      
    }}).then(x=>{
      res.send(x)
    })
 })
  }catch(err){
    console.log(err);
    return res.send("Error adding files")
  }
    
});

router.put("/Books/:BookID", verifyToken,UpdateBookMiddlewere ,async (req,res)=>{
  const {
  Narrator,
  Summary
} = req.body;
const ID = req.params.BookID;
const book = await prisma.books.findFirst({where:{
  ID:+ID
}})
if(!book){
  return res.send("Book doesn't exist")
}
await prisma.books.update({where:{ID:+ID},data:{Narrator , Summary}})
return res.send("Book Updated...");
});

router.delete("/Books/:BookID", verifyToken,async (req,res)=>{
  
const ID = req.params.BookID
console.log("HIIIII  "+ID)
const book = await prisma.books.findFirst({where:{
  ID:+ID
}});
console.log(book);

if(!book){
  return res.send("Book doesn't exist")
}
await prisma.books.delete({where:{ID:+ID}})
return res.send("Book Deleted...")
});

router.get("/Books", verifyToken , async (req,res)=>{
  try {
    const BooksPerPage = parseInt(req.query.limit as string, 10);
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageNumber = isNaN(page) || page < 1 ? 1 : page;
    const maxBooks = await prisma.books.count();
    const maxPages = Math.ceil(maxBooks / BooksPerPage);
    const books = await prisma.books.findMany({
      skip: (pageNumber - 1) * BooksPerPage,
      take: BooksPerPage,
      select: {
        ID: true,
        Title:true,
        AuthorID:true,
        PublisherID:true,
        Summary:true,
        Language:true,
        Narrator:true,
        ListningTime:{
          select:{
            Time:true,
            BookID:true,
            ListenerID:true,
            Finished:true,
          }
        },
        Files:{
          select:{Cover:true , Audio:true , Demo:true}
        },
        Author: {
      select: {
        ID: true,
        AuthorFullName: true,  
      },
      },
    }
  });

    res.send({
      page: pageNumber,
      maxPages,
      books,
    });
  } catch (err) {
    console.error("Error getting Books:", err);
    return res.status(500).send("Error getting Books...");
  }
});


router.get("/Books/:BookID", verifyToken , async (req,res)=>{
  try {
    const ID = req.params.BookID
    const book = await prisma.books.findFirst({
      where:{ID:+ID},
      select:{
        ID:true,
        Publisher:{select:{PublisherName:true}},
        Title:true,
        Narrator:true,
        NumberOfPages:true,
        Summary:true,
        Language:true,
        Author:{select:{AuthorFullName:true , ID:true}}
      }
    });
    const files = await prisma.files.findFirst({where:{
      BookID:book.ID,
      
    }, select:{Cover:true , Audio:true , Demo:true}})
    if(!files)
      return res.send("Book not found or has no files yet...")
    
    
    res.send({book , files});
  } catch (err) {
    console.error("Error getting Book:", err);
    return res.status(500).send("Error getting Book...");
  }
})

router.get("/Category/:Name", verifyToken , async (req,res)=>{
    const Name = req.params.Name
    const BooksPerPage = parseInt(req.query.limit as string, 10);
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageNumber = isNaN(page) || page < 1 ? 1 : page;
    const maxBooks = await prisma.books.count();
    const maxPages = Math.ceil(maxBooks / BooksPerPage);
    if(!Name)
        return res.send("Missing Name")
    Name[0].toUpperCase
    const exist = await prisma.category.findFirst({where:{
        Name
    }})
    if(!exist)
        return res.send("Category doesn't exist")
     const books = await prisma.books.findMany({
      skip: (pageNumber - 1) * BooksPerPage,
      take: BooksPerPage,
      where:{
      Categories:{
        every:{
          Name
        }
      }
      },
      select: {
        ID: true,
        Title:true,
        AuthorID:true,
        PublisherID:true,
        Summary:true,
        Language:true,
        Narrator:true,
        Files:{
          select:{Cover:true , Audio:true , Demo:true}
        },
        Author: {
      select: {
        ID: true,
        AuthorFullName: true,  
      },
      },
    }
  });

    res.send({
      page: pageNumber,
      maxPages,
      books,
    });
})
router.get("/Finished", verifyToken , async (req,res)=>{
  try{
    const decodedToken = (req as any).decodedToken;
    const ID = decodedToken.ID;
    const listener = await prisma.listeners.findFirst({where:{ID:+ID}})
    if(!listener){
        return res.send("Id not valid user not found...")
      }
    const BooksPerPage = parseInt(req.query.limit as string, 10);
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageNumber = isNaN(page) || page < 1 ? 1 : page;
    const maxBooks = await prisma.books.count();
    const maxPages = Math.ceil(maxBooks / BooksPerPage)
   const finishedBooks = await prisma.listningTime.findMany({
      where: {
        Finished: true,
        ListenerID:ID
      },
      include: {
        Book: 
          {select:
            {ID:true,
            Author: { select: { AuthorFullName: true, ID: true } },
            Title: true,
            Summary:true,
            Narrator: true,
            Files:{select:{Cover:true , Demo:true ,Audio:true}},
            ListningTime:{where:{
                ListenerID:listener.ID
            }}
    
        }},
      },
      skip: (pageNumber - 1) * BooksPerPage,
      take: BooksPerPage,
      }); 
      res.send(
      finishedBooks
    );
  } catch(e){return res.send("Error getting fav books")}
 
})
export default router;