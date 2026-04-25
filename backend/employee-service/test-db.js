const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const employees = await prisma.employee.findMany();
    console.log("Success fetching employees:", employees.length);
  } catch (error) {
    console.error("Prisma error:", error);
  }
}

main().finally(() => prisma.$disconnect());
