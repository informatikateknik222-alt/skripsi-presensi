const http = require('http');

http.get('http://localhost:4000/api/employees', (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
