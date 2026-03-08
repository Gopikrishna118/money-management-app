import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDB } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const register = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;
  
  if (!email.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Only Gmail addresses are allowed for registration.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    const db = getDB();
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role || 'user']
    );
    res.status(201).json({ message: 'User registered successfully', userId: result.lastID });
  } catch (err: any) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Only Gmail addresses are allowed to login.' });
  }

  try {
    const db = getDB();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err: any) {
    console.error('Login Error:', err);
    res.status(500).json({ error: err.message });
  }
};
