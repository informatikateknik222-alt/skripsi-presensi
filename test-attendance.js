const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 4000,
  path: '/api/attendance',
  method: 'GET',
  headers: {
    // Kami perlu ngasih auth header kalau memang wajib
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log(`BODY: ${body}`));
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
