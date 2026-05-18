const { PrismaClient: EmployeeClient } = require('./apps/employee/prisma/client');
const { PrismaClient: AttendanceClient } = require('./apps/attendance/prisma/client');
const { PrismaClient: PayrollClient } = require('./apps/payroll/prisma/client');

async function main() {
  const empPrisma = new EmployeeClient({ datasources: { db: { url: "postgresql://postgres:rahasia123@localhost:5434/postgres?schema=employee" } } });
  const attPrisma = new AttendanceClient({ datasources: { db: { url: "postgresql://postgres:rahasia123@localhost:5434/postgres?schema=attendance" } } });
  const payPrisma = new PayrollClient({ datasources: { db: { url: "postgresql://postgres:rahasia123@localhost:5434/postgres?schema=payroll" } } });

  try {
    console.log("Seeding data...");
    
    // 1. Employee
    const dept = await empPrisma.department.create({ data: { name: 'IT Support', description: 'IT Department' } });
    const pos = await empPrisma.position.create({ data: { name: 'Staff', description: 'General Staff' } });
    
    const emp = await empPrisma.employee.create({
      data: {
        name: 'Budi Santoso',
        email: 'budi@example.com',
        phoneNumber: '081234567890',
        joinDate: new Date(),
        departmentId: dept.id,
        positionId: pos.id,
        userId: 'USER_BUDI_123'
      }
    });
    console.log("Created employee:", emp.name);

    // 2. Attendance
    const today = new Date();
    await attPrisma.attendance.create({
      data: {
        userId: emp.userId,
        date: today,
        checkIn: today,
        status: 'PRESENT',
        notes: 'Hadir tepat waktu'
      }
    });

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    await attPrisma.attendance.create({
      data: {
        userId: emp.userId,
        date: yesterday,
        checkIn: yesterday,
        status: 'PRESENT',
        notes: 'Hadir tepat waktu'
      }
    });
    console.log("Created attendance records");

    // 3. Payroll
    await payPrisma.payrollRecord.create({
      data: {
        employeeId: emp.id_pegawai,
        periodMonth: today.getMonth() + 1,
        periodYear: today.getFullYear(),
        basicSalary: 5000000,
        allowances: 1000000,
        deductions: 200000,
        netSalary: 5800000,
        status: 'PAID',
        paymentDate: today
      }
    });
    
    await payPrisma.payrollRecord.create({
      data: {
        employeeId: emp.id_pegawai,
        periodMonth: today.getMonth() + 2, // Next month pending
        periodYear: today.getFullYear(),
        basicSalary: 5000000,
        allowances: 1000000,
        deductions: 200000,
        netSalary: 5800000,
        status: 'PENDING'
      }
    });
    console.log("Created payroll records");

  } catch (e) {
    console.error(e);
  } finally {
    await empPrisma.$disconnect();
    await attPrisma.$disconnect();
    await payPrisma.$disconnect();
  }
}

main();
