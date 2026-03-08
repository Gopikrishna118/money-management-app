import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function checkData() {
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  console.log('--- USERS ---');
  const users = await db.all('SELECT id, username, email, role FROM users');
  console.table(users);

  console.log('--- TRANSACTIONS ---');
  const transactions = await db.all('SELECT id, user_id, amount, type FROM transactions');
  console.table(transactions);

  console.log('--- SUMMARY QUERY TEST ---');
  const summary = await db.all(`
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
    FROM transactions
  `);
  console.table(summary);

  await db.close();
}

checkData();
