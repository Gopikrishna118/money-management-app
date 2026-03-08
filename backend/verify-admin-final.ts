import jwt from 'jsonwebtoken';
import axios from 'axios';

const JWT_SECRET = 'supersecretkey';

async function verifyAdminDashboard() {
  try {
    // Generate an admin token
    const token = jwt.sign(
      { id: 3, username: 'venu', role: 'admin' }, // Match an actual admin from your DB
      JWT_SECRET
    );

    console.log('Testing GET http://localhost:8080/api/admin/dashboard');

    const response = await axios.get('http://localhost:8080/api/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('API Status:', response.status);
    console.log('Total Income:', response.data.totalIncome);
    console.log('Total Expense:', response.data.totalExpense);
    console.log('User Count:', response.data.users.length);

    if (response.data.totalIncome > 0) {
      console.log('SUCCESS: Admin Dashboard is returning non-zero data!');
    } else {
      console.warn('WARNING: Total Income is still 0. This might be correct if no user has transactions, but please check.');
    }

  } catch (err: any) {
    console.error('API Verification Failed:', err.response?.data || err.message);
  }
}

verifyAdminDashboard();
