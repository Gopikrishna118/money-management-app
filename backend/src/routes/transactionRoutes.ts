import express from 'express';
import { getTransactions, createTransaction, deleteTransaction } from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getTransactions);
router.post('/', authenticateToken, createTransaction);
router.delete('/:id', authenticateToken, deleteTransaction);

export default router;
