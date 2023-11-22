import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../middlewere';
import { CreatePublisherMiddlewere, UpdatePublisherMiddlewere } from './PublisherDto';
const prisma = new PrismaClient();
const router = express.Router();

router.post("/Publisher",verifyToken,CreatePublisherMiddlewere ,async(req,res)=>{
    try{
    const {PublisherName, Email, Phone, Website} = req.body;
    const publisherExists = await prisma.publisher.findFirst({
        where:{
            Email,
            Phone,
            Website,
        }
    })
    if(publisherExists)
        return res.send('Publisher already exists')
    await prisma.publisher.create({
        data:{
            PublisherName,
            Email,
            Phone,
            Website
        }
    }).then(x=>{
        return res.send(x)
    })
    }catch(error){
        console.log(error);
        return res.send("Error while making a publisher...")
    }
})

router.put("/Publisher/:ID",verifyToken,UpdatePublisherMiddlewere,async(req,res)=>{
    
    const ID = req.params.ID;
     const {PublisherName, Email, Phone, Website} = req.body;
     const publisherExists = await prisma.publisher.findFirst({
        where:{
            ID:+ID
        }
    })
    if(!publisherExists){
       
        
        return res.send("Publisher doen't exist")
        
    }
    await prisma.publisher.update({
        where:{ID:+ID},
        data:{
            PublisherName,
            Email,
            Phone,
            Website
        }
    }).then(x=>{
        
        return res.send(x)
    })
});

router.delete("/Publisher/:ID", verifyToken,async (req,res)=>{
    const ID = req.params.ID;
    const publisher = await prisma.publisher.findFirst({where:{
        ID:+ID
    }})
    if(!publisher)
        return res.send("Publisher not found...")
    await prisma.publisher.delete({where:{
        ID:+ID
    }}).then(x=>{
        return res.send(x)
    })
});

router.get("/Publisher/:ID", verifyToken,async (req,res)=>{
  const ID = req.params.ID
  const publisher = await prisma.publisher.findFirst({where:{
    ID:+ID
  }})
  if(!publisher){
    return res.send("Publisher Not Found...")
  }
  return res.send(publisher)
})

router.get("/Publisher",verifyToken, async (req,res)=>{
    try {
    const publishersPerPage = parseInt(req.query.limit as string, 10);
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageNumber = isNaN(page) || page < 1 ? 1 : page;
    const maxPublishers = await prisma.listeners.count();
    const maxPages = Math.ceil(maxPublishers/ publishersPerPage);
    const publishers = await prisma.publisher.findMany({
      skip: (pageNumber - 1) * publishersPerPage,
      take:publishersPerPage,
      select: {
        ID: true,
        PublisherName: true,
        Email: true,
        Phone: true,
        Website:true
      },
    });
    res.send({
      page: pageNumber,
      maxPages,
      publishers,
    });
  } catch (err) {
    console.log("Error getting Publishers:", err);
    return res.status(500).send("Error getting Publishers...");
  }
})
export default router;