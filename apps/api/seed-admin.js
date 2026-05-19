const { PrismaClient } = require('./apps/employee/prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:rahasia123@localhost:5434/presensi?schema=employee"
    }
  }
});

async function main() {
  console.log("Seeding Admin Data...");

  // 1. Create or Find Department
  const dept = await prisma.department.upsert({
    where: { name: 'Manajemen' },
    update: {},
    create: {
      name: 'Manajemen',
      description: 'Departemen Manajemen dan Administrasi'
    }
  });

  // 2. Create or Find Position
  const pos = await prisma.position.upsert({
    where: { name: 'Direktur' },
    update: {},
    create: {
      name: 'Direktur',
      description: 'Direktur Utama Rumah Sakit'
    }
  });

  // 3. Create Admin Employee
  const admin = await prisma.employee.upsert({
    where: { email: 'admin@efarina.com' },
    update: {
      name: 'Admin Efarina',
      userId: 'admin' // Ini match dengan yang di dummy login
    },
    create: {
      name: 'Admin Efarina',
      email: 'admin@efarina.com',
      phoneNumber: '081234567890',
      joinDate: new Date(),
      userId: 'admin',
      department: { connect: { id: dept.id } },
      position: { connect: { id: pos.id } }
    }
  });

  // Buat juga contoh pegawai biasa
  const staff = await prisma.employee.upsert({
    where: { email: 'user_budi@efarina.com' },
    update: {
      name: 'Budi Santoso',
      userId: 'USER_BUDI_123' 
    },
    create: {
      name: 'Budi Santoso',
      email: 'user_budi@efarina.com',
      phoneNumber: '08987654321',
      joinDate: new Date(),
      userId: 'USER_BUDI_123',
      department: { connect: { id: dept.id } },
      position: { connect: { id: pos.id } }
    }
  });

  console.log("Seeding selesai!");
  console.log("Admin tersimpan:", admin);
  console.log("Staff tersimpan:", staff);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
