import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import prisma from '../db.js'
import AppError from '../utils/AppError.js';

export const newUserRegisteration = async(email,pass)=>{
  try{
    if(pass.length<8){
    throw new AppError('Password must be atleast 8 characters',400);
    }
    const alreadyExist = await prisma.user.findUnique({where:{email}});
    if(alreadyExist){
      throw new AppError('Email already exists! Sign in with your email',409);
    }
    const passwordHash=await bcrypt.hash(pass,10);
    const user=await prisma.user.create({data:{email,passwordHash }});
    return {id:user.id,email:user.email};
  } catch(error){
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(error.message || 'Internal server error', 500);
  }
};
export const login=async(email,pass)=>{
  try{
    const user=await prisma.user.findUnique({where:{email}});
    if(!user){
      throw new AppError('Invalid credentials',401);
    }
    const passMatch=await bcrypt.compare(pass,user.passwordHash);
    if(!passMatch){
      throw new AppError('Invalid credentials',401);
    }
    const token = jwt.sign({userId:user.id},process.env.JWT_SECRET,{expiresIn:'1d'});
    return {user:{id:user.id,email:user.email},token};
  } catch(error){
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(error.message || 'Internal server error', 500);
  }
};