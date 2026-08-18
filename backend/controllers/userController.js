import * as userService from '../services/userService.js';
export const getProfile=async(req,res,next)=>{
  try{
    console.log("Decoded Token Data:", req.user);
    const user=await userService.getProfile(req.user.userId);
    res.json({data:user});
  } catch(err){
    next(err);
  }
};
export const updateProfile=async(req, res, next)=>{
  const {name,bio}=req.body??{};
  try{
    const user=await userService.updateProfile(req.user.userId,name,bio);
    res.json({data:user});
  } catch(err){
    next(err);
  }
};
export const changePassword=async(req,res,next)=>{
  const {currentPassword,newPassword}=req.body??{};
  if (!currentPassword||!newPassword){
    return res.status(400).json({error:'Current and new password are required'});
  }
  try {
    await userService.changePassword(req.user.userId,currentPassword,newPassword);
    res.json({data:{message:'Password updated successfully'}});
  } catch(err){
    next(err);
  }
};
export const deleteAccount=async(req,res,next)=>{
  try{
    await userService.deleteAccount(req.user.userId);
    res.status(204).send();
  } catch(err){
    next(err);
  }
};