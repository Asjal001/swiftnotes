import * as noteService from '../services/noteService.js';
import AppError from '../utils/AppError.js';

export const addNote= async(req,res,next)=>{
  try{
    const {title,content}=req.body??{};
    if(!title||typeof title!=='string'||!title.trim()){
      throw new AppError('Title is required',400);
    }
    const note= await noteService.addNote(req.user.userId,title,content);
    res.status(201).json({data:note});
  } catch(err){
    next(err);
  }
};
export const getNotes= async(req,res,next)=>{
  try{
    const notes= await noteService.getNotes(req.user.userId);
    res.json({data:notes});
  } catch(err){
    next(err);
  }
};
export const getNote=async(req,res,next)=>{
  try{
    const {id}=req.params;
    const note=await noteService.getNote(id,req.user.userId);
    res.json({data:note});
  } catch(err){
    next(err);
  }
};
export const updateNote= async(req,res,next)=>{
  try{
    const {title,content}=req.body??{};
    const {id}=req.params;
    if(!title||typeof title!=='string'||!title.trim()){
      throw new AppError('Title is required',400);
    }
    const note= await noteService.updateNote(id,req.user.userId,title,content);
    res.json({data:note});
  } catch(err){
    next(err);
  }
};
export const deleteNote= async(req,res,next)=>{
  try{
    const {id}=req.params;
    await noteService.deleteNote(id,req.user.userId);
    res.status(204).send();
  } catch(err){
    next(err);
  }
};