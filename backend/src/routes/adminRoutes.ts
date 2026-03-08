import express from 'express';
import { getDashboardData, getReportsRankings } from '../controllers/adminController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', authenticateToken, isAdmin, getDashboardData);
router.get('/reports/rankings', authenticateToken, isAdmin, getReportsRankings);

export default router;
