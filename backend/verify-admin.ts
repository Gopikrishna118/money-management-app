import jwt from 'jsonwebtoken';
import axios from 'axios';

const JWT_SECRET = 'supersecretkey';

async function verifyAdminDashboard() {
  try {
    // Generate an admin token for User 2 (Venu)
    const token = jwt.sign(
      { id: 2, username: 'Venu', role: 'admin' },
      JWT_SECRET
    );

    console.log('Using Admin Token:', token);

    const response = await axios.get('http://localhost:8080/api/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('--- ADMIN DASHBOARD DATA ---');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (err: any) {
    console.error('API Verification Failed:', err.response?.data || err.message);
  }
}

verifyAdminDashboard();
