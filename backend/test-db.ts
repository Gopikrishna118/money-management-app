import pool from './src/config/db';

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', res.rows[0]);
    
    // Check if users table exists
    const tableRes = await pool.query("SELECT to_regclass('public.users') as table_exists");
    console.log('Users table check:', tableRes.rows[0]);
  } catch (err) {
    console.error('Database connection failed:', err);
  } finally {
    await pool.end();
  }
}

testConnection();
