const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function test() {
  const prisma = new PrismaClient();
  try {
    const emps = await prisma.employee.findMany();
    fs.writeFileSync('prisma-test-out.txt', 'SUCCESS: ' + JSON.stringify(emps));
  } catch (err) {
    fs.writeFileSync('prisma-test-out.txt', 'ERROR: ' + err.message + '\n\n' + err.stack);
  } finally {
    await prisma.$disconnect();
  }
}
test();
