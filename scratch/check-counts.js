const { PrismaClient } = require('@prisma/client');

async function check() {
  const auth = new PrismaClient({ datasourceUrl: "postgresql://postgres:rahasia123@localhost:5432/auth_db" });
  const emp = new PrismaClient({ datasourceUrl: "postgresql://postgres:rahasia123@localhost:5432/employee_db" });
  const att = new PrismaClient({ datasourceUrl: "postgresql://postgres:rahasia123@localhost:5432/attendance_db" });
  const pay = new PrismaClient({ datasourceUrl: "postgresql://postgres:rahasia123@localhost:5432/payroll_db" });

  try {
    const counts = {
      users: await auth.user.count().catch(() => 'error'),
      employees: await emp.employee.count().catch(() => 'error'),
      attendance: await att.attendance.count().catch(() => 'error'),
      payroll: await pay.payrollRecord.count().catch(() => 'error'),
    };
    console.log(JSON.stringify(counts));
  } finally {
    await auth.$disconnect();
    await emp.$disconnect();
    await att.$disconnect();
    await pay.$disconnect();
  }
}

check();
