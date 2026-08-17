import prisma from '../db.js';
import AppError from '../utils/AppError.js';

export const addNote=async(userId,title,content)=>{
  try{
    return await prisma.note.create({data:{title,content,userId}});
  } catch(err){
    throw new AppError(err.message||'Failed to create note',500);
  }
};
export const getNotes=async(userId)=>{
  try{
    return await prisma.note.findMany({
      where:{userId},
      orderBy:{createdAt:'desc'}
    });
  } catch(err){
    throw new AppError(err.message||'Failed to fetch notes',500);
  }
};
export const getNote=async(noteId,userId)=>{
  try{
    const note=await prisma.note.findFirst({
      where:{id:noteId,userId }
    }); 
    if(!note){
      throw new AppError('Note not found', 404);
    }
    return note;
  } catch(err){
    if(err instanceof AppError) throw err;
    throw new AppError(err.message||'Failed to fetch note', 500);
  }
};
export const updateNote=async(noteId,userId,title,content)=>{
  try{
    const note = await prisma.note.findFirst({where:{id:noteId,userId}});
    if(!note){
      throw new AppError('Note not found',404);
    }
    return await prisma.note.update({
      where:{id:noteId},
      data:{title,content}
    });
  } catch(err){
    if(err instanceof AppError) throw err;
    throw new AppError(err.message||'Failed to update note',500);
  }
};
export const deleteNote=async(noteId,userId)=>{
  try{
    const res= await prisma.note.deleteMany({where:{id:noteId,userId}});
    if(res.count===0){
      throw new AppError('Note not found',404)
    }
  } catch(err){
    if(err instanceof AppError) throw err;
    throw new AppError(err.message||'Failed to delete note',500);
  }
};