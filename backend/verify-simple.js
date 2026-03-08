const jwt = require('jsonwebtoken');
const http = require('http');

const JWT_SECRET = 'supersecretkey';

function verify() {
  const token = jwt.sign(
    { id: 3, username: 'venu', role: 'admin' },
    JWT_SECRET
  );

  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/admin/dashboard',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error('Problem with request:', e.message);
  });

  req.end();
}

verify();
