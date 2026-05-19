const { PrismaClient } = require('./apps/employee/prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:rahasia123@localhost:5434/presensi?schema=employee"
    }
  }
});

async function main() {
  console.log("Seeding Departments and Positions...");

  const departments = [
    "Keperawatan",
    "Gizi",
    "Manajemen",
    "Umum",
    "Laboratorium",
    "Farmasi",
    "Keuangan",
    "Kebidanan",
    "Administrasi",
    "Radiologi"
  ];

  const positions = [
    "Perawat Pelaksana",
    "Ahli Gizi",
    "Staf IT",
    "Kepala Ruangan",
    "Satpam",
    "Analis Kesehatan",
    "Pramusaji",
    "Apoteker",
    "Kasir",
    "Bidan Pelaksana",
    "Rekam Medis",
    "Radiografer",
    "Supir Ambulans",
    "Asisten Apoteker",
    "Staf Keuangan",
    "Kepala SDM"
  ];

  let addedDepts = 0;
  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept },
      update: {},
      create: { name: dept, description: `Departemen ${dept}` }
    });
    addedDepts++;
  }

  let addedPos = 0;
  for (const pos of positions) {
    await prisma.position.upsert({
      where: { name: pos },
      update: {},
      create: { name: pos, description: `Jabatan ${pos}` }
    });
    addedPos++;
  }

  console.log(`Berhasil menambahkan ${addedDepts} Departemen dan ${addedPos} Jabatan.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
