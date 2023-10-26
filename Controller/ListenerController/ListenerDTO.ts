import { IsString,Length, IsEmail, IsUrl, Matches  ,validate, isEmail, isPhoneNumber } from 'class-validator';
import { Response , Request, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class SignUp {
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 50, { message: 'Username should not be empty' })
    Username:string;
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(6, 50, { message: 'Password should not be empty or too short' })
     Password: string;
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 50, { message: 'UserFullName should not be empty' })
    UserFullName:string;
    @IsEmail()
    @Length(1, 50, { message: 'Email should not be empty' })
    Email:string;
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Matches(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: 'Invalid phone number' })
    Phone: string;
}

class Login {
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 50, { message: 'Username should not be empty' })
    Username:string;
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(6, 50, { message: 'Password should not be empty or too short' })
     Password: string;
}

class UpdateProfile {
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Length(1, 50, { message: 'Username should not be empty' })
    UserFullName:string;
    @IsEmail()
    @Length(1, 50, { message: 'Email should not be empty' })
    Email:string;
    @IsString({message:"Must be a vaild type (String,Int,...)"})
    @Matches(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: 'Invalid phone number' })
    Phone: string;
}

async function SignInMiddlewere(req:Request, res:Response , next:NextFunction) {
    const SignUpDto = plainToClass(SignUp, req.body);
    const errors = await validate(SignUpDto);
    if (errors.length > 0) {
    return res.status(400).json({ errors: errors.map(error => error.constraints) });
  }
  const user = await prisma.listeners.findFirst({where:{
    Username:SignUpDto.Username
  }})
  if(user){
    return res.send("Someone with that Username already exists...")
  }
  next();
}

async function LoginMiddlewere(req:Request , res:Response , next:NextFunction) {
    const LoginDto = plainToClass(Login, req.body);
    const errors = await validate(LoginDto);
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors.map(error => error.constraints) });
  }
  const user =  await prisma.listeners.findFirst({where:{
    Username:LoginDto.Username,
    Password:LoginDto.Password
  }})
  if(!user){
    return res.send("User not found...")
  }
  next()
}


async function UpdateProfileMiddlewere(req:Request , res:Response , next:NextFunction) {
    const UpdateDto= plainToClass(UpdateProfile, req.body);
    const errors = await validate(UpdateDto);
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors.map(error => error.constraints) });
  }
  next()
}


export  {SignInMiddlewere , LoginMiddlewere , UpdateProfileMiddlewere}