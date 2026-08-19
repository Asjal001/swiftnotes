import express from 'express';
import {getProfile,updateProfile,changePassword,deleteAccount} from '../controllers/userController.js';
import {verifyToken} from '../middlewares/authMiddleware.js';

const router=express.Router();
router.use(verifyToken);
router.get('/profile',getProfile);
router.patch('/profile',updateProfile);
router.patch('/password',changePassword);
router.delete('/',deleteAccount);
export default router;