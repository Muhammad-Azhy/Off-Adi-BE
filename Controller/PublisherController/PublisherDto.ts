import { IsString,Length, IsEmail, IsUrl, Matches  ,validate, isEmail, isPhoneNumber, isURL } from 'class-validator';
import { Response , Request, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { PrismaClient } from '@prisma/client';


class NewPublisher {
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 50, { message: 'Publisher Name should not be empty' })
    PublisherName:string;
    @IsEmail()
    @Length(1, 50, { message: 'Email should not be empty' })
    Email:string;
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Matches(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: 'Invalid phone number' })
    Phone: string;
    @IsString()
    @IsUrl({}, { message: 'Invalid URL' }) // Specify a custom message for the validation
    Website:string
}

class UpdatePublisher{
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 50, { message: 'Publisher Name should not be empty' })
    PublisherName:string;
    @IsEmail()
    @Length(1, 50, { message: 'Email should not be empty' })
    Email:string;
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Matches(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: 'Invalid phone number' })
    Phone: string;
    @IsString()
    @IsUrl({}, { message: 'Invalid URL' }) 
    Website:string
}

async function UpdatePublisherMiddlewere(req:Request , res:Response , next:NextFunction) {
    const PublisherDto= plainToClass(UpdatePublisher, req.body);
    const errors = await validate(PublisherDto);
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors.map(error => error.constraints) });
  }
  next()
}


async function CreatePublisherMiddlewere(req:Request , res:Response , next:NextFunction) {
    const PublisherDto= plainToClass(NewPublisher, req.body);
    const errors = await validate(PublisherDto);
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors.map(error => error.constraints) });
  }
  next()
}

export {CreatePublisherMiddlewere, UpdatePublisherMiddlewere}