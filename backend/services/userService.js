import prisma from '../db.js';
import AppError from '../utils/AppError.js';
import bcrypt from 'bcrypt';

export const getProfile=async(userId)=>{
  const user=await prisma.user.findUnique({
    where:{id:userId},
    select:{id:true,email:true,name:true,bio:true,createdAt:true},
  });
  if(!user) throw new AppError('User not found',404);
  return user;
};
export const updateProfile=async(userId,name,bio)=>{
  return prisma.user.update({
    where:{id:userId},
    data:{name,bio},
    select:{id:true,email:true,name:true,bio:true},
  });
};
export const changePassword=async(userId,currentPassword,newPassword)=>{
  const user=await prisma.user.findUnique({where:{id:userId}});
  if(!user) throw new AppError('User not found',404);
  const isMatch=await bcrypt.compare(currentPassword,user.passwordHash);
  if(!isMatch) throw new AppError('Current password is incorrect',400);
  if(newPassword.length<8) throw new AppError('Password must be at least 8 characters', 400);
  const passwordHash=await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where:{id:userId},
    data: {passwordHash}
  });
};
export const deleteAccount=async(userId)=>{
  await prisma.user.delete({where:{id:userId}});
};