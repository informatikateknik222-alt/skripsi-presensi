const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/employees',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`BODY: ${data}`);
  });
});

req.on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
req.end();
