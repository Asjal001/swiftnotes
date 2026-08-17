import express from 'express';
import { addNote,getNote,getNotes,updateNote,deleteNote } from '../controllers/noteController.js';
import {verifyToken} from '../middlewares/authMiddleware.js';

const router=express.Router();
router.use(verifyToken);
router.post('/',addNote);
router.get('/',getNotes);
router.get('/:id', getNote);
router.patch('/:id',updateNote);
router.delete('/:id',deleteNote);
export default router;