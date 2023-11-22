import { IsInt, IsString, IsNotEmpty, Min, Max, Length , validate} from 'class-validator';
import { Response , Request, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


async function FavBookMiddlewere(req:Request , res:Response , next:NextFunction) {
  try{

    const BookID = req.params.BookID;
  const decodedToken = (req as any).decodedToken;
  const ID = decodedToken.ID;
 if(!BookID || !ID)
    return res.send("Missing URL parameters")
  const book = await prisma.books.findFirst({ where: { ID: +BookID } });
  if (!book) 
    return res.send("Book doesn't exist...");
  const listener = await prisma.listeners.findFirst({ where: { ID: +ID } });
  if (!listener) 
    return res.send('Listener not found...');
    next()

  }
  catch(e){
    res.send("Error while adding books")
  }
 
}
export {FavBookMiddlewere}
