const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const departments = [
  { name: 'Instalasi Gawat Darurat (IGD)', description: 'Pelayanan darurat 24 jam' },
  { name: 'Rawat Jalan (Poliklinik)', description: 'Pelayanan konsultasi rawat jalan' },
  { name: 'Rawat Inap', description: 'Pelayanan perawatan pasien menginap' },
  { name: 'Instalasi Bedah Sentral (IBS)', description: 'Layanan operasi / bedah' },
  { name: 'Instalasi Farmasi', description: 'Pengelolaan obat dan alat kesehatan' },
  { name: 'Laboratorium', description: 'Pemeriksaan patologi klinik dan anatomi' },
  { name: 'Radiologi', description: 'Pemeriksaan rontgen, USG, CT Scan' },
  { name: 'Rekam Medis', description: 'Pengelolaan data pasien' },
  { name: 'Manajemen & Administrasi', description: 'Operasional manajerial rumah sakit' },
  { name: 'Keuangan & Akuntansi', description: 'Pengelolaan finansial dan billing' },
  { name: 'Sumber Daya Manusia (HRD)', description: 'Manajemen kepegawaian' },
  { name: 'IT & Sistem Informasi', description: 'Pemeliharaan sistem dan jaringan' },
  { name: 'Pemeliharaan Sarana Prasarana', description: 'Maintenance fasilitas rumah sakit' },
  { name: 'Instalasi Gizi', description: 'Penyediaan nutrisi pasien' }
];

const positions = [
  { name: 'Direktur Utama', description: 'Pimpinan tertinggi rumah sakit' },
  { name: 'Manajer / Kepala Bidang', description: 'Pimpinan tingkat divisi / bidang' },
  { name: 'Kepala Ruangan / Instalasi', description: 'Koordinator unit teknis' },
  { name: 'Dokter Spesialis', description: 'Tenaga medis spesialis' },
  { name: 'Dokter Umum', description: 'Tenaga medis umum' },
  { name: 'Perawat', description: 'Tenaga keperawatan' },
  { name: 'Bidan', description: 'Tenaga kebidanan' },
  { name: 'Apoteker', description: 'Tenaga profesional farmasi' },
  { name: 'Asisten Apoteker', description: 'Asisten pelayanan farmasi' },
  { name: 'Analis Laboratorium (ATLM)', description: 'Ahli teknologi laboratorium medik' },
  { name: 'Radiografer', description: 'Petugas radiologi' },
  { name: 'Perekam Medis', description: 'Petugas rekam medis' },
  { name: 'Staf Administrasi', description: 'Tenaga administrasi dan tata usaha' },
  { name: 'Staf IT / Programmer', description: 'Tenaga dukungan teknologi' },
  { name: 'Petugas Kebersihan', description: 'Tenaga sanitasi / cleaning service' },
  { name: 'Petugas Keamanan', description: 'Satpam / Security' }
];

async function main() {
  console.log('Menambahkan data Departemen...');
  for (const dept of departments) {
    try {
      await prisma.department.upsert({
        where: { name: dept.name },
        update: {},
        create: dept,
      });
      console.log(`- Added/Verified Department: ${dept.name}`);
    } catch (e) {
      console.log(`Gagal menambah ${dept.name}: ${e.message}`);
    }
  }

  console.log('\nMenambahkan data Jabatan...');
  for (const pos of positions) {
    try {
      await prisma.position.upsert({
        where: { name: pos.name },
        update: {},
        create: pos,
      });
      console.log(`- Added/Verified Position: ${pos.name}`);
    } catch (e) {
      console.log(`Gagal menambah ${pos.name}: ${e.message}`);
    }
  }

  console.log('\nSeeding selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
