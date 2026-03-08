import express from 'express';
import { deleteAccount } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.delete('/:id', authenticateToken, deleteAccount);

export default router;
