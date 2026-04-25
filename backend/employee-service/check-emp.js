const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const emp = await prisma.employee.findFirst();
  console.log(JSON.stringify(emp, null, 2));
}

check().finally(() => prisma.$disconnect());
