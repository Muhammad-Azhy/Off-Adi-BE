import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../middlewere';
import jwt from "jsonwebtoken";
const prisma = new PrismaClient()
const router = express.Router()

router.post("/Category", verifyToken, async (req,res)=>{
    const Name = req.body.Name;
    if(!Name)
        return res.send("Missing Name")
    Name[0].toUpperCase
    const exist = await prisma.category.findFirst({where:{
        Name
    }})
    if(exist)
        return res.send("Category already exists")
    await prisma.category.create({data:{
        Name
    }}).then(x=>{
        return res.send(x)
    })
})

router.get("/Category" , verifyToken , async (req,res)=>{
    await prisma.category.findMany().then(x=>{
        return res.send(x)
    })
})

router.get("/Category/:ID" , verifyToken , async (req,res)=>{
    const ID = req.params.ID;
    const category =await prisma.category.findFirst(
        {where:{ID:+ID}}
    ).then(x=>{
        return res.send(x)
    })
    if(!category)
        return res.send("Category Not Found...")
})

router.delete("/Category/:ID" , verifyToken , async (req,res)=>{
   
    const ID = req.params.ID;
     
    
    const category = await prisma.category.findFirst(
        {where:{ID:+ID}}
    )
    if(!category)
        return res.send("Category Not Found...")
    await prisma.category.delete({where:{
        ID:+ID
    }})
    res.send("Deleted...")
})

router.put("/Category/:ID", verifyToken ,async (req ,res) => {
    const ID = req.params.ID
    const Name = req.body.Name;
    
    if(!Name)
        return res.send("Missing Name")
   
  
    Name[0].toUpperCase
    const exist = await prisma.category.findFirst({where:{
        ID:+ID
    }})
    if(!exist)
        return res.send("Category doesn't exist")
        await prisma.category.update({where:{ID:+ID} , data:{Name}})
        await prisma.category.findMany().then(x=>{
        res.send(x)
    })
})

export default router
