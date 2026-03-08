import { Response } from 'express';
import { getDB } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  const { type, startDate, endDate } = req.query;
  try {
    const db = getDB();
    let query = 'SELECT t.*, c.name as category_name FROM transactions t LEFT JOIN categories c ON t.category_id = c.id';
    const params: any[] = [];

    if (req.user?.role !== 'admin') {
      query += ' WHERE t.user_id = ?';
      params.push(req.user?.id);
    } else {
      query += ' WHERE 1=1';
    }

    if (type) {
      query += ' AND t.type = ?';
      params.push(type);
    }
    if (startDate) {
      query += ' AND t.transaction_date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND t.transaction_date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY t.transaction_date DESC';
    const rows = await db.all(query, params);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  const { category_id, amount, type, description, transaction_date } = req.body;
  try {
    const db = getDB();
    const result = await db.run(
      'INSERT INTO transactions (user_id, category_id, amount, type, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user?.id, category_id, amount, type, description, transaction_date || new Date().toISOString().split('T')[0]]
    );
    res.status(201).json({ id: result.lastID, user_id: req.user?.id, category_id, amount, type, description, transaction_date });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const db = getDB();
    await db.run('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, req.user?.id]);
    res.json({ message: 'Transaction deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
