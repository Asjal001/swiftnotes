import * as authService from '../services/authService.js';
import jwt from 'jsonwebtoken';

export const signup=async(req,res,next)=>{
  const rawEmail = req.body?.email;
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
  const pass = req.body?.pass;

  if (!email || !pass || typeof pass !== 'string') {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try{
    const user = await authService.newUserRegisteration(email,pass);
    const token = jwt.sign({userId:user.id},process.env.JWT_SECRET,{expiresIn:'1d'});
    res.status(201).json({data:{ user,token}});
  } catch(err){
    next(err);
  }
};
export const login=async(req,res,next)=>{
  const {email,pass}=req.body??{};
  if(!email||!pass||typeof email!=='string'||typeof pass!=='string'){
    return res.status(400).json({error:'Email and password are required'});
  }
  try{
    const user = await authService.login(email.toLowerCase().trim(),pass);
    res.json({data:user});
  } catch(err){
    next(err);
  }
};