import { IsInt, IsString, IsNotEmpty, Min, Max, Length , validate} from 'class-validator';
import { Response , Request, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class BookRatingDto {
  @IsInt({ message: 'BookID must be an integer' })
  @Min(1, { message: 'BookID should be at least 1' })
  BookID: number;

  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating should be at least 1' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  Rating: number;

  @IsNotEmpty({ message: 'Review should not be empty' })
  @Length(1, 250, { message: 'Review length should be between 1 and 250 characters' })
  Review: string;
}

async function BookRatingMiddlewere(req:Request , res:Response , next:NextFunction) {
  const validationObject = plainToClass(BookRatingDto, req.body);
  const errors = await validate(validationObject);
   const ID = req.params.ID;
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors.map((error) => error.constraints) });
  }

  const book = await prisma.books.findFirst({ where: { ID: +validationObject.BookID } });

  if (!book) {
    return res.send("Book doesn't exist...");
  }
  
  const listener = await prisma.listeners.findFirst({ where: { ID: +ID } });

  if (!listener) {
    return res.send('Listener not found...');
  }
}


async function UpdateBookRatingMiddlewere(req:Request , res:Response , next:NextFunction) {
  const validationObject = plainToClass(BookRatingDto, req.body);
  const errors = await validate(validationObject);
   const ID = req.params.RatingID;
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors.map((error) => error.constraints) });
  }

  const book = await prisma.books.findFirst({ where: { ID: +validationObject.BookID } });

  if (!book) {
    return res.send("Book doesn't exist...");
  }
  
  const Rating = await prisma.bookRating.findFirst({ where: { ID: +ID } });

  if (!Rating) {
    return res.send('Rating not found...');
  }
}
export {BookRatingMiddlewere,UpdateBookRatingMiddlewere}