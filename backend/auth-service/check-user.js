const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { username: 'admin' } });
  console.log("User from DB:", user);
  if (user) {
    const isMatch = await bcrypt.compare('rahasia123', user.password);
    console.log("Password match with 'rahasia123':", isMatch);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
