import express from 'express';
import { addNote,getNotes,updateNote,deleteNote } from '../controllers/noteController.js';
import {verifyToken} from '../middlewares/authMiddleware.js';

const router=express.Router();
router.use(verifyToken);
router.post('/',addNote);
router.get('/',getNotes);
router.put('/:id',updateNote);
router.delete('/:id',deleteNote);
export default router;