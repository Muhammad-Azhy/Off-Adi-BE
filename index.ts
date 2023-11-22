import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import ListenerCont from "./Controller/ListenerController/ListenerCont"
import PublisherCont from "./Controller/PublisherController/PublisherCont"
import AuthorCont from"./Controller/AuthorController/AuthorCont"
import BookCont from "./Controller/BookController/BookCont"
import BookRateCont from "./Controller/BookRateController/BookRatingCont"
import FavBookCont from "./Controller/FavBooksController/FavBookCont"
import LibraryCont from "./Controller/LibraryController/LibraryCont"
import CartCont from "./Controller/CartController/CartCont"
import CategoryCont from "./Controller/Catagory/CategoryCont"
import ListenigTime from "./Controller/ListenTimeController/ListenTimeCont"
import http from "http";
import cors from "cors"
import path from 'path';
import multer from "multer"
import { verifyToken } from './middlewere';
const app = express();
const prisma = new PrismaClient();
//http://localhost:3001/Media/${file.originalname}
app.use(cors())
app.use(express.json())


app.use('/Media', express.static( './Media'));
app.use("/", ListenerCont)
app.use("/", PublisherCont)
app.use("/", AuthorCont)
app.use("/", BookCont)
app.use("/", BookRateCont)
app.use("/", FavBookCont)
app.use("/", LibraryCont)
app.use("/", ListenigTime)
app.use("/", CartCont);
app.use("/", CategoryCont);
const server = http.createServer(app);
const PORT =  3001;

type CallbackFunction = (error: Error | null, destination: string) => void;
const fileStorageEngine = multer.diskStorage({
  destination: (req:Request, file:Express.Multer.File, cb:CallbackFunction) => {
    cb(null, "./Media");
  },
 filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, file.originalname);
  }
})
export const uploader = multer({ storage: fileStorageEngine }).fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
  { name: 'demo', maxCount: 1 }
])

app.get("/GetAll",verifyToken , async (req,res)=>{
  const books = await prisma.books.findMany({
      select: {
        ID: true,
        Title:true,
        AuthorID:true,
        PublisherID:true,
        Summary:true,
        Language:true,
        Narrator:true,
        NumberOfPages:true,
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
  const authors = await prisma.author.findMany({
      select: {
        ID: true,
        AuthorFullName: true,
        Email: true,
        Phone: true
      },
  })
  const categories =  await prisma.category.findMany();
  const publishers = await prisma.publisher.findMany({
      select: {
        ID: true,
        PublisherName: true,
        Email: true,
        Phone: true,
        Website:true
      },
  });

  return res.send({
    Books:books,
    Categories:categories,
    Authors:authors,
    Publishers:publishers
  })
})
server.listen(PORT, () => {
  console.log("SERVER RUNNING ON PORT 3001");
});