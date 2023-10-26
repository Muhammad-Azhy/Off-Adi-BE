import { IsString,Length, IsEmail, IsUrl, Matches  ,validate, isEmail, isPhoneNumber } from 'class-validator';
import { Response , Request, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
