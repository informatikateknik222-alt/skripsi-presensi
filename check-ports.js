const http = require('http');

function checkPort(port, name) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/api/docs`, (res) => {
      resolve(`${name} (Port ${port}) is RUNNING (Status: ${res.statusCode})`);
    }).on('error', (e) => {
      resolve(`${name} (Port ${port}) is NOT reachable (${e.message})`);
    });
    req.end();
  });
}

async function main() {
  const gateway = await checkPort(4000, 'API Gateway');
  const auth = await checkPort(4001, 'Auth Service');
  const emp = await checkPort(4002, 'Employee Service');
  console.log(gateway);
  console.log(auth);
  console.log(emp);
}

main();
