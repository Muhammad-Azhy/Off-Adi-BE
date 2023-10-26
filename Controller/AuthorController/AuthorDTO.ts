import { IsString,Length, IsEmail, IsUrl, Matches  ,validate, isEmail, isPhoneNumber, isURL } from 'class-validator';
import { Response , Request, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';


class NewAuthor {
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 50, { message: 'Author Full Name should not be empty' })
    AuthorFullName:string;
    @IsEmail()
    @Length(1, 50, { message: 'Email should not be empty' })
    Email:string;
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Matches(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: 'Invalid phone number' })
    Phone: string;
}


class UpdateAuthor{
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 50, { message: 'Author Full Name should not be empty' })
    AuthorFullName:string;
    @IsEmail()
    @Length(1, 50, { message: 'Email should not be empty' })
    Email:string;
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Matches(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: 'Invalid phone number' })
    Phone: string;
}


async function CreateAuthorMiddlewere(req:Request , res:Response , next:NextFunction) {
    const AuthorDto= plainToClass(NewAuthor, req.body);
    const errors = await validate(AuthorDto);
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors.map(error => error.constraints) });
  }
  next()
}


async function UpdateAuthorMiddlewere(req:Request , res:Response , next:NextFunction) {
    const UpdateAuthorDto= plainToClass(UpdateAuthor, req.body);
    const errors = await validate(UpdateAuthorDto);
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors.map(error => error.constraints) });
  }
  next()
}

export {CreateAuthorMiddlewere , UpdateAuthorMiddlewere}

