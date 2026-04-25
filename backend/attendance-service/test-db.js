const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const records = await prisma.attendance.findMany();
    console.log("Success fetching attendance:", records.length);
  } catch (error) {
    console.error("Prisma error:", error.message);
  }
}

main().finally(() => prisma.$disconnect());
