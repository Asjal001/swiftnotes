import express from 'express';
import { addNote,getNote,getNotes,updateNote,deleteNote,summarizeNote, transcribeVoice, toggleShareNote, getSharedNote } from '../controllers/noteController.js';
import {verifyToken} from '../middlewares/authMiddleware.js';

const router=express.Router();
router.get('/shared/:shareToken', getSharedNote);
router.use(verifyToken);
router.post('/',addNote);
router.get('/',getNotes);
router.post('/transcribe', transcribeVoice);
router.get('/:id', getNote);
router.patch('/:id',updateNote);
router.delete('/:id',deleteNote);
router.post('/:id/summarize', summarizeNote);
router.post('/:id/share', toggleShareNote);
export default router;