import { IsString,Length, IsEmail, IsUrl, Matches  ,validate, isEmail, isPhoneNumber, isURL, isInt, isString, IsNumber } from 'class-validator';
import { Response , Request, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { PrismaClient } from '@prisma/client';
import multer, { Multer } from 'multer';
import path from "path";

const prisma = new PrismaClient();

class NewBook {
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 50, { message: 'PublisherName should not be empty' })
    PublisherName:string;
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 50, { message: 'Title should not be empty' })
    Title:string;
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 50, { message: 'Authors full name should not be empty' })
    AuthorFullName: string;
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 50, { message: 'Narrator should not be empty' })// Specify a custom message for the validation
    Narrator:string;
    @IsNumber()
    Language:number
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 250, { message: 'Summary is needed' })
    Summary:string
    @IsString()
    @Length(1, 250, { message: ' Categories are needed' })
    Category:string
}

class UpdateBook{
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 50, { message: 'Narrator should not be empty' })// Specify a custom message for the validation
    Narrator:string;
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 250, { message: 'Summary is needed' })
    Summary:string
}

async function CreateBookMiddlewere(req:Request , res:Response , next:NextFunction) {
    const BookDto= plainToClass(NewBook, req.body);
    const DtoErrors = await validate(BookDto);
  if (DtoErrors.length > 0) {
    return res.status(400).json({ errors: DtoErrors.map(error => error.constraints) });
  }
  const {
      PublisherName,
      AuthorFullName,
      NumberOfPages,
      Category
    } = req.body;
  if(isNaN(NumberOfPages)||!NumberOfPages){
      return res.send("Number of pages is invalid")
    }
    const publisher = await prisma.publisher.findFirst({where:{
      PublisherName
    }});
    if(!publisher){
      return res.send("Publisher Not Found...")
    }
    const Author = await prisma.author.findFirst({where:{
      AuthorFullName
    }})
    if(!Author){
      return res.send("Author Not Found...")
    } 
    const Categories = await prisma.category.findFirst({where:{
      Name:Category
    }})
    if(!Categories){
      return res.send("No Category found with that name")
    }
   
  next()
}


async function UpdateBookMiddlewere(req:Request , res:Response , next:NextFunction) {
    const BookDto= plainToClass(UpdateBook, req.body);
    const DtoErrors = await validate(BookDto);
  if (DtoErrors.length > 0) {
    return res.status(400).json({ errors: DtoErrors.map(error => error.constraints) });
  }
  next()
}

export {CreateBookMiddlewere, UpdateBookMiddlewere}