import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../middlewere';
const prisma = new PrismaClient();
const router = express.Router();

router.post("/ListenTime/:BookID", verifyToken , async (req,res)=>{
    const BookID = req.params.BookID
    const decodedToken = (req as any).decodedToken;
    const myID = decodedToken.ID;
    const {Time , Finished} = req.body;
    Time.toString()
    
    let ListenTime = await prisma.listningTime.findFirst({where:{
        BookID:+BookID,
        ListenerID:myID
    }});
    if(!ListenTime){
        await prisma.listningTime.create({
            data:{
                ListenerID:myID,
                BookID:+BookID,
                Time,
                Finished
            }
        }).then(x=>{
            res.send(x)
        })
    }
    await prisma.listningTime.update({
        where:{
         ID:ListenTime.ID
        },
        data:{
        Time,
        Finished
    }    
}).then(x=>{
    res.send(x)
})
});

router.get("/ListenTime/:BookID" , verifyToken ,async (req,res)=>{
    const BookID = req.params.BookID;
    const decodedToken = (req as any).decodedToken;
    const myID = decodedToken.ID
    let ListenTime = await prisma.listningTime.findFirst({where:{
        BookID:+BookID,
        ListenerID:myID
    }})
    if(!ListenTime){
        await prisma.listningTime.create({
        data:{Time:"0:00", BookID:+BookID,Finished:false,ListenerID:myID}
    }).then(x=>{return res.send(x)})
    }
    else{
        return res.send([ListenTime]);
    }
    
})
export default router;