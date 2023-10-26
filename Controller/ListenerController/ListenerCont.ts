import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {SignInMiddlewere, LoginMiddlewere, UpdateProfileMiddlewere } from "./ListenerDTO"
import { verifyToken } from '../../middlewere';
import jwt from "jsonwebtoken"
const prisma = new PrismaClient();
const router = express.Router();

router.post("/SignUp", SignInMiddlewere,async (req,res)=>{

  const {Username ,Password , Email , UserFullName , Phone} = req.body;
  await prisma.listeners.create({data:{
    UserFullName,
    Password,
    Phone,
    Email,
    Username,
  }}).then(x=>{
    res.send(x)
  })
})

router.post("/Login",LoginMiddlewere, async (req,res)=>{
    const {Username, Password} = req.body
      await prisma.listeners.findFirst({where:{
      Username,
      Password
   }}).then(async (x)=>{
    const ID = x.ID;
      const token = jwt.sign({ID:x.ID},"jdbvudfge") //env not working??
      res.json({
        ID,
        Username,
        token,
      })
   });
})

router.put("/Listeners/:ID",verifyToken, UpdateProfileMiddlewere ,async (req,res)=>{
  const ID = req.params.ID
  const {UserFullName , Email , Phone} = req.body
  const listener = await prisma.listeners.findFirst({where:{
    ID:+ID
  }})
  if(!listener)
    return res.send("listener not found...")
  await prisma.listeners.update({
    where: { ID: +ID },
   data:{UserFullName,Email ,Phone}
  }).then(x=>{
    return res.send(x)
  })
})

router.delete('/Listeners/:ID', verifyToken , async (req,res) => {
   const ID = req.params.ID;
  const listener = await prisma.listeners.findFirst({where:{
    ID:+ID
  }})
  if(!listener)
    return res.send("listener not found...")
   await prisma.listeners.delete({
    where: { ID: +ID },
  })
})

router.get("/Listeners/:ID",async (req,res)=> {
  const ID = req.params.ID
  const listener = await prisma.listeners.findFirst({where:{
    ID:+ID
  }})
  if(!listener){
    return res.send("Listener Not Found...")
  }
})
router.get("/Listeners", async (req, res) => {

  try {
    const listenersPerPage = parseInt(req.query.limit as string, 10);
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageNumber = isNaN(page) || page < 1 ? 1 : page;
    const maxListeners = await prisma.listeners.count();
    const maxPages = Math.ceil(maxListeners / listenersPerPage);
    const listeners = await prisma.listeners.findMany({
      skip: (pageNumber - 1) * listenersPerPage,
      take: listenersPerPage,
      select: {
        ID: true,
        UserFullName: true,
        Email: true,
        Phone: true
      },
    });

    res.send({
      page: pageNumber,
      maxPages,
      listeners,
    });
  } catch (err) {
    console.error("Error getting listeners:", err);
    return res.status(500).send("Error getting listeners...");
  }
});

export default router