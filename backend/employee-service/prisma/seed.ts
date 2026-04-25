import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.employee.deleteMany();
  await prisma.position.deleteMany();
  await prisma.department.deleteMany();

  console.log('Seeding Departments (Divisi/Unit Rumah Sakit)...');
  const dUGD = await prisma.department.create({ data: { name: 'Instalasi Gawat Darurat (IGD)', description: 'Pelayanan Medis Darurat 24 Jam' } });
  const dRawatInap = await prisma.department.create({ data: { name: 'Rawat Inap', description: 'Pelayanan Pasien Menginap' } });
  const dPoli = await prisma.department.create({ data: { name: 'Poliklinik / Rawat Jalan', description: 'Pelayanan Rawat Jalan Reguler' } });
  const dICU = await prisma.department.create({ data: { name: 'ICU / NICU', description: 'Perawatan Intensif' } });
  const dFarmasi = await prisma.department.create({ data: { name: 'Instalasi Farmasi', description: 'Pelayanan Obat dan Alat Kesehatan' } });
  const dLab = await prisma.department.create({ data: { name: 'Laboratorium Medis', description: 'Pelayanan Uji Sampel Medis' } });
  const dRadiologi = await prisma.department.create({ data: { name: 'Radiologi', description: 'Pelayanan X-Ray, MRI, CT-Scan' } });
  const dRekamMedis = await prisma.department.create({ data: { name: 'Rekam Medis', description: 'Manajemen Data Pasien' } });
  const dGizi = await prisma.department.create({ data: { name: 'Instalasi Gizi', description: 'Pelayanan Konsumsi Pasien' } });
  const dHRD = await prisma.department.create({ data: { name: 'HRD & Administrasi', description: 'Manajemen SDM dan Umum' } });
  const dKeuangan = await prisma.department.create({ data: { name: 'Keuangan & Kasir', description: 'Manajemen Keuangan RS' } });
  const dIT = await prisma.department.create({ data: { name: 'Sistem Informasi (IT)', description: 'Manajemen Jaringan dan Sistem' } });
  const dIPSRS = await prisma.department.create({ data: { name: 'IPSRS', description: 'Pemeliharaan Sarana dan Prasarana RS' } });
  const dKeamanan = await prisma.department.create({ data: { name: 'Keamanan (Security)', description: 'Keamanan Lingkungan RS' } });

  console.log('Seeding Positions (Jabatan / Profesi)...');
  const pDokterSpesialis = await prisma.position.create({ data: { name: 'Dokter Spesialis', description: 'Tenaga Medis Spesialis (PNS/Kontrak)' } });
  const pDokterUmum = await prisma.position.create({ data: { name: 'Dokter Umum', description: 'Tenaga Medis Umum' } });
  const pKaru = await prisma.position.create({ data: { name: 'Kepala Ruangan (Karu)', description: 'Koordinator Perawat Ruangan' } });
  const pPerawat = await prisma.position.create({ data: { name: 'Perawat Pelaksana', description: 'Tenaga Keperawatan' } });
  const pBidan = await prisma.position.create({ data: { name: 'Bidan', description: 'Tenaga Kebidanan' } });
  const pApoteker = await prisma.position.create({ data: { name: 'Apoteker', description: 'Penanggung Jawab Farmasi' } });
  const pAsistenApoteker = await prisma.position.create({ data: { name: 'Asisten Apoteker', description: 'Staf Pelaksana Farmasi' } });
  const pAnalisLab = await prisma.position.create({ data: { name: 'Analis Laboratorium', description: 'Tenaga Laboratorium Medis' } });
  const pRadiografer = await prisma.position.create({ data: { name: 'Radiografer', description: 'Tenaga Radiologi' } });
  const pAhliGizi = await prisma.position.create({ data: { name: 'Ahli Gizi', description: 'Dietisien RS' } });
  const pPerekamMedis = await prisma.position.create({ data: { name: 'Perekam Medis', description: 'Staf Rekam Medis' } });
  const pStafAdmin = await prisma.position.create({ data: { name: 'Staf Administrasi', description: 'Back Office / Pendaftaran' } });
  const pKasir = await prisma.position.create({ data: { name: 'Kasir', description: 'Staf Keuangan Pelayanan' } });
  const pStafIT = await prisma.position.create({ data: { name: 'Staf IT Support', description: 'Dukungan Teknis' } });
  const pTeknisi = await prisma.position.create({ data: { name: 'Teknisi Medis / Umum', description: 'Pemeliharaan Alat' } });
  const pSatpam = await prisma.position.create({ data: { name: 'Satpam', description: 'Petugas Keamanan' } });

  console.log('Seeding Employees...');
  const employees = [
    // IGD
    { userId: 'u-igd-01', name: 'dr. Andi Gunawan, Sp.EM', email: 'andi.g@rsefarina.test', phoneNumber: '081111111101', joinDate: new Date('2018-01-15'), departmentId: dUGD.id, positionId: pDokterSpesialis.id },
    { userId: 'u-igd-02', name: 'dr. Budi Santoso', email: 'budi.s@rsefarina.test', phoneNumber: '081111111102', joinDate: new Date('2020-03-01'), departmentId: dUGD.id, positionId: pDokterUmum.id },
    { userId: 'u-igd-03', name: 'Siti Rahmawati, S.Kep., Ns.', email: 'siti.r@rsefarina.test', phoneNumber: '081111111103', joinDate: new Date('2019-06-10'), departmentId: dUGD.id, positionId: pKaru.id },
    { userId: 'u-igd-04', name: 'Ahmad Faisal, AMK', email: 'ahmad.f@rsefarina.test', phoneNumber: '081111111104', joinDate: new Date('2021-02-20'), departmentId: dUGD.id, positionId: pPerawat.id },
    
    // Rawat Inap & ICU
    { userId: 'u-ri-01', name: 'dr. Diana Lestari, Sp.PD', email: 'diana.l@rsefarina.test', phoneNumber: '081111111105', joinDate: new Date('2017-08-01'), departmentId: dRawatInap.id, positionId: pDokterSpesialis.id },
    { userId: 'u-icu-01', name: 'dr. Eko Prasetyo, Sp.An', email: 'eko.p@rsefarina.test', phoneNumber: '081111111106', joinDate: new Date('2018-11-11'), departmentId: dICU.id, positionId: pDokterSpesialis.id },
    { userId: 'u-ri-02', name: 'Fitri Handayani, AMK', email: 'fitri.h@rsefarina.test', phoneNumber: '081111111107', joinDate: new Date('2022-01-05'), departmentId: dRawatInap.id, positionId: pPerawat.id },
    { userId: 'u-icu-02', name: 'Rini Yulianti, S.Kep., Ns.', email: 'rini.y@rsefarina.test', phoneNumber: '081111111108', joinDate: new Date('2020-10-15'), departmentId: dICU.id, positionId: pPerawat.id },
    { userId: 'u-ri-03', name: 'Lia Kusuma, Amd.Keb', email: 'lia.k@rsefarina.test', phoneNumber: '081111111109', joinDate: new Date('2023-04-12'), departmentId: dRawatInap.id, positionId: pBidan.id },

    // Poliklinik
    { userId: 'u-poli-01', name: 'dr. Hendra Wijaya, Sp.A', email: 'hendra.w@rsefarina.test', phoneNumber: '081111111110', joinDate: new Date('2015-05-20'), departmentId: dPoli.id, positionId: pDokterSpesialis.id },
    { userId: 'u-poli-02', name: 'dr. Maya Sari, Sp.OG', email: 'maya.s@rsefarina.test', phoneNumber: '081111111111', joinDate: new Date('2016-09-09'), departmentId: dPoli.id, positionId: pDokterSpesialis.id },
    { userId: 'u-poli-03', name: 'Nurul Hidayah, AMK', email: 'nurul.h@rsefarina.test', phoneNumber: '081111111112', joinDate: new Date('2021-07-22'), departmentId: dPoli.id, positionId: pPerawat.id },

    // Penunjang Medis (Farmasi, Lab, Radiologi, Gizi, RM)
    { userId: 'u-far-01', name: 'Drs. Antonius, Apt.', email: 'antonius@rsefarina.test', phoneNumber: '081111111113', joinDate: new Date('2019-03-10'), departmentId: dFarmasi.id, positionId: pApoteker.id },
    { userId: 'u-far-02', name: 'Bambang Sugiarto', email: 'bambang.s@rsefarina.test', phoneNumber: '081111111114', joinDate: new Date('2022-08-08'), departmentId: dFarmasi.id, positionId: pAsistenApoteker.id },
    { userId: 'u-lab-01', name: 'Citra Kirana, Amd.AK', email: 'citra.k@rsefarina.test', phoneNumber: '081111111115', joinDate: new Date('2020-02-14'), departmentId: dLab.id, positionId: pAnalisLab.id },
    { userId: 'u-rad-01', name: 'Dodi Hermawan, Amd.Rad', email: 'dodi.h@rsefarina.test', phoneNumber: '081111111116', joinDate: new Date('2018-12-05'), departmentId: dRadiologi.id, positionId: pRadiografer.id },
    { userId: 'u-gizi-01', name: 'Endah Susilowati, S.Gz', email: 'endah.s@rsefarina.test', phoneNumber: '081111111117', joinDate: new Date('2021-09-30'), departmentId: dGizi.id, positionId: pAhliGizi.id },
    { userId: 'u-rm-01', name: 'Fahmi Idris, Amd.PK', email: 'fahmi.i@rsefarina.test', phoneNumber: '081111111118', joinDate: new Date('2022-11-11'), departmentId: dRekamMedis.id, positionId: pPerekamMedis.id },

    // Non-Medis (HRD, Keuangan, IT, IPSRS, Keamanan)
    { userId: 'u-hrd-01', name: 'Gita Pertiwi, S.Psi', email: 'gita.p@rsefarina.test', phoneNumber: '081111111119', joinDate: new Date('2019-05-18'), departmentId: dHRD.id, positionId: pStafAdmin.id },
    { userId: 'u-keu-01', name: 'Hadi Kurniawan, SE', email: 'hadi.k@rsefarina.test', phoneNumber: '081111111120', joinDate: new Date('2020-07-07'), departmentId: dKeuangan.id, positionId: pKasir.id },
    { userId: 'u-it-01', name: 'Indra Lesmana, S.Kom', email: 'indra.l@rsefarina.test', phoneNumber: '081111111121', joinDate: new Date('2021-01-20'), departmentId: dIT.id, positionId: pStafIT.id },
    { userId: 'u-ipsrs-01', name: 'Joko Anwar', email: 'joko.a@rsefarina.test', phoneNumber: '081111111122', joinDate: new Date('2018-04-15'), departmentId: dIPSRS.id, positionId: pTeknisi.id },
    { userId: 'u-sec-01', name: 'Komarudin', email: 'komarudin@rsefarina.test', phoneNumber: '081111111123', joinDate: new Date('2017-02-28'), departmentId: dKeamanan.id, positionId: pSatpam.id },
    
    // Auth-db Admin Sync (Admin login dummy)
    { userId: 'admin', name: 'Administrator Utama', email: 'admin@rsefarina.test', phoneNumber: '080000000000', joinDate: new Date('2015-01-01'), departmentId: dHRD.id, positionId: pStafIT.id }
  ];

  for (const emp of employees) {
    await prisma.employee.create({ data: emp });
  }

  console.log(`Seeding finished successfully! Inserted ${employees.length} Dummy Employees.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
