const { PrismaClient } = require('./apps/attendance/node_modules/@prisma/client');

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://postgres:rahasia123@localhost:5434/default_db?schema=public"
      }
    }
  });

  try {
    console.log("Dropping extra databases...");
    await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS attendance_db;`);
    await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS auth_db;`);
    await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS employee_db;`);
    await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS payroll_db;`);
    await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS db_presensi;`);
    console.log("Successfully dropped extra databases.");
  } catch (error) {
    console.error("Error dropping databases:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
