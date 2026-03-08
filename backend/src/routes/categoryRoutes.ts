import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getCategories);
router.post('/', authenticateToken, createCategory);

export default router;
