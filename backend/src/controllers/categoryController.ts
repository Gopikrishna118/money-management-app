import { Response } from 'express';
import { getDB } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const db = getDB();
    const rows = await db.all(
      'SELECT * FROM categories WHERE user_id IS NULL OR user_id = ?',
      [req.user?.id]
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  const { name, type } = req.body;
  try {
    const db = getDB();
    const result = await db.run(
      'INSERT INTO categories (name, type, user_id) VALUES (?, ?, ?)',
      [name, type, req.user?.id]
    );
    res.status(201).json({ id: result.lastID, name, type, user_id: req.user?.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
