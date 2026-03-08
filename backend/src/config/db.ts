import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database;

export const initDB = async () => {
  db = await open({
    filename: path.join(__dirname, '../../database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT CHECK (type IN ('income', 'expense')),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id),
        amount DECIMAL(12, 2) NOT NULL,
        type TEXT CHECK (type IN ('income', 'expense')),
        description TEXT,
        transaction_date DATE DEFAULT (DATE('now')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed initial categories if empty
  const count = await db.get('SELECT COUNT(*) as count FROM categories WHERE user_id IS NULL');
  if (count.count === 0) {
    await db.run("INSERT INTO categories (name, type) VALUES ('Salary', 'income')");
    await db.run("INSERT INTO categories (name, type) VALUES ('Food', 'expense')");
    await db.run("INSERT INTO categories (name, type) VALUES ('Rent', 'expense')");
    await db.run("INSERT INTO categories (name, type) VALUES ('Utilities', 'expense')");
    await db.run("INSERT INTO categories (name, type) VALUES ('Entertainment', 'expense')");
    await db.run("INSERT INTO categories (name, type) VALUES ('Transport', 'expense')");
  }

  return db;
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};
