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
  console.log(JSON.stringify(users, null, 2));

  console.log('--- TRANSACTIONS ---');
  const transactions = await db.all('SELECT id, user_id, amount, type FROM transactions');
  console.log(JSON.stringify(transactions, null, 2));

  await db.close();
}

checkData();
