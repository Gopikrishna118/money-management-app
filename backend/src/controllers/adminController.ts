import { Response } from 'express';
import { getDB } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const db = getDB();
    
    // 1. Get Total Summary
    const summary = await db.get(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpense
      FROM transactions
    `);

    // 2. Get User Statistics
    const users = await db.all(`
      SELECT 
        u.username as name, 
        u.email,
        SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as totalExpense
      FROM users u
      LEFT JOIN transactions t ON u.id = t.user_id
      GROUP BY u.id
    `);

    const response = {
      totalIncome: summary.totalIncome || 0,
      totalExpense: summary.totalExpense || 0,
      users: users.map(u => ({
        ...u,
        totalIncome: u.totalIncome || 0,
        totalExpense: u.totalExpense || 0
      }))
    };

    console.log('Admin Dashboard Response:', JSON.stringify(response, null, 2));
    res.json(response);
  } catch (err: any) {
    console.error('Admin Dashboard Error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getReportsRankings = async (req: AuthRequest, res: Response) => {
  try {
    const db = getDB();
    
    // Get stats for all users
    const users = await db.all(`
      SELECT 
        u.username as name, 
        SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as totalExpense
      FROM users u
      LEFT JOIN transactions t ON u.id = t.user_id
      GROUP BY u.id
    `);

    // Sort for earners
    const topEarners = [...users]
      .sort((a, b) => (b.totalIncome || 0) - (a.totalIncome || 0))
      .map(u => ({ name: u.name, totalIncome: u.totalIncome || 0 }));

    // Sort for spenders
    const topSpenders = [...users]
      .sort((a, b) => (b.totalExpense || 0) - (a.totalExpense || 0))
      .map(u => ({ name: u.name, totalExpense: u.totalExpense || 0 }));

    res.json({ topEarners, topSpenders });
  } catch (err: any) {
    console.error('Rankings calculation error:', err);
    res.status(500).json({ error: err.message });
  }
};
