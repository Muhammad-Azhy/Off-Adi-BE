import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../middlewere';
import jwt from "jsonwebtoken"
import { CreateAuthorMiddlewere, UpdateAuthorMiddlewere } from './AuthorDTO';
const prisma = new PrismaClient();
const router = express.Router()


router.post("/Author",verifyToken,CreateAuthorMiddlewere,async (req,res)=>{
    const {AuthorFullName , Email , Phone}= req.body;
    const authorExists = await prisma.author.findFirst({where:{AuthorFullName, Phone}})
    if(authorExists)
        return res.send("Author with that name already exists")
    await prisma.author.create({
        data:{
            AuthorFullName,
            Email,
            Phone,
        }
    }).then(x=>{
        return res.send(x)
    })
})

router.put("/Author/:AuthorID", verifyToken,UpdateAuthorMiddlewere, async (req,res)=>{
     const ID = req.params.AuthorID;
     const {AuthorFullName, Email, Phone} = req.body;
     const authorExists = await prisma.author.findFirst({
        where:{
            ID:+ID
        }
    })
    if(!authorExists)
        return res.send("Author doen't exist")
    await prisma.author.update({
        where:{ID:+ID},
        data:{
            AuthorFullName,
            Email,
            Phone,
        },
    }).then(async x=>{
       const authors =  await prisma.author.findMany()
        return res.send(authors)
    })
})

router.delete("/Author/:AuthorID", verifyToken,async (req,res)=>{
    const decodedToken = (req as any).decodedToken;
     const ID = req.params.AuthorID;
    const author = await prisma.author.findFirst({where:{
        ID:+ID
    }})
    if(!author)
        return res.send("Author not found...")
    await prisma.author.delete({where:{
        ID:+ID
    }}).then(x=>{
        return res.send("Author Deleted...")
    })
})

router.get("/Author/:AuthorID", verifyToken , async (req,res)=>{
  const ID = req.params.AuthorID
  const author = await prisma.author.findFirst({where:{
    ID:+ID
  }})
  if(!author){
    return res.send("Auhtor Not Found...")
  }
 
  return res.send(author)
})

router.get("/Author", verifyToken,async(req,res)=>{
    try {
    const authorPerPage = parseInt(req.query.limit as string, 10);
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageNumber = isNaN(page) || page < 1 ? 1 : page;
    const maxAuthors = await prisma.author.count();
    const maxPages = Math.ceil(maxAuthors/ authorPerPage);
    const authors = await prisma.author.findMany({
      skip: (pageNumber - 1) * authorPerPage,
      take:authorPerPage,
      select: {
        ID: true,
        AuthorFullName: true,
        Email: true,
        Phone: true
      },
    });
    res.send({
      page: pageNumber,
      maxPages,
      authors,
    });
  } catch (err) {
    console.error("Error getting authors:", err);
    return res.status(500).send("Error getting authors...");
  }
})

export default router