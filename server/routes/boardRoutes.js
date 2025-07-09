import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from '../controllers/boardController.js';

const router = express.Router();

router.get('/', protect, getBoards);
router.post('/', protect, createBoard);
router.put('/:id', protect, updateBoard);
router.delete('/:id', protect, deleteBoard);

export default router;
