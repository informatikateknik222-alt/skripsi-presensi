const http = require('http');

const data = JSON.stringify({
  username: 'admin',
  password: 'rahasia123'
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', body));
});

req.on('error', error => console.error("REQUEST ERROR:", error));
req.write(data);
req.end();
