const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/employees',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer asdf'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
req.end();
