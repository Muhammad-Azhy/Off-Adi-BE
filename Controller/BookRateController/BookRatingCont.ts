import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../middlewere';
import { BookRatingMiddlewere, UpdateBookRatingMiddlewere } from './BookRatingDTO';
const prisma = new PrismaClient();
const router = express.Router();


router.post("/BookRating/:BookID" , verifyToken ,BookRatingMiddlewere , async (req,res)=>{
    const { Rating , Review} = req.body
   const decodedToken = (req as any).decodedToken;
    const ID = decodedToken.ID;
    const BookID = req.params.BookID;
    const book = await prisma.books.findFirst({where:{
        ID:+BookID
    }});
    const listener = await prisma.listeners.findFirst({where:{ID:+ID}})
    await prisma.bookRating.create({
        data:{
             Book:{connect:{
                ID:book.ID
            }},
            Reader:{
                connect:{
                    ID:listener.ID
                }
            },
            Rating,
            Review,
            RatingDate: new Date(),
        }
    })
})

router.put("/BookRating/:BookID/:RatingID", verifyToken, UpdateBookRatingMiddlewere ,async (req , res) => {
    const decodedToken = (req as any).decodedToken;
    const MyID = decodedToken.ID;
    const ID = req.params.RatingID; //Rating ID
    const {Rating , Review} = req.body
    const YourRating = await prisma.bookRating.findFirst({where:{
        ReaderID:MyID,
        ID:+ID
    }})
    if(!YourRating)
        return res.send("Not Your Rating...")
    await prisma.bookRating.update({where:{ReaderID:MyID,ID:+ID},
    data:{
        Rating,
        Review
    }
    })
})

router.delete("/BookRating/:BookID/:RatingID", verifyToken, async (req,res)=> {
    const decodedToken = (req as any).decodedToken;
    const MyID = decodedToken.ID;
    const RatingID = req.params.RatingID; //Rating ID
    const BookID = req.params.BookID
    const YourRating = await prisma.bookRating.findFirst({where:{
        ReaderID:MyID,
        ID:+RatingID
    }})
    if(!YourRating)
        return res.send("Not Your Rating...")
    await prisma.bookRating.delete({where:{ReaderID:MyID,ID:+RatingID}})
    await prisma.books.update({where:{ID:+BookID} , data:{
        BookRatings:{disconnect:{ID:+RatingID}}
    }})
    return res.send("Rating Deleted")
})

router.get("/BookRating/:BookID", verifyToken , async (req,res)=>{
    try {
    const BookID = req.params.BookID;
    const RatingPerPage = parseInt(req.query.limit as string, 10);
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageNumber = isNaN(page) || page < 1 ? 1 : page;
    const maxRatings = await prisma.bookRating.count({where:{
        BookID:+BookID
    }});
    const maxPages = Math.ceil(maxRatings / RatingPerPage);
    const ratings = await prisma.bookRating.findMany({
      where:{BookID:+BookID},
      skip: (pageNumber - 1) * RatingPerPage,
      take: RatingPerPage,
      select: {
        ID: true,
        Review:true,
        Rating:true,
        Reader:{select:{UserFullName:true}},
        Book:{select:{Title:true}} 
      },
  })
    res.send({
      page: pageNumber,
      maxPages,
      ratings,
    });
  } catch (err) {
    console.error("Error getting Ratings:", err);
    return res.status(500).send("Error getting Ratings...");
  }
})

router.get("BookRating/:RatingID" , verifyToken , async (req,res)=>{
    try {
    const ID = req.params.ID
    const rating = await prisma.bookRating.findFirst({
      where:{ID:+ID},});
    return res.send(rating);
  } catch (err) {
    console.error("Error getting rating:", err);
    return res.status(500).send("Error getting rating...");
  }
})
export default router;