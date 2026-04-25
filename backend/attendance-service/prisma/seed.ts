import { PrismaClient, AttendanceStatus, LeaveType, LeaveStatus } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing attendance data...');
  await prisma.attendance.deleteMany();
  await prisma.leaveRequest.deleteMany();

  const userIdAndi = '7f2a1z9x-qwer-tyui-asdf-1234567890ab';
  const userIdSiti = '8f3b2y8w-zxcv-bnmg-hjkl-0987654321cd';
  const userIdBudi = '9e4c3x7v-poiu-ytre-wqas-abcdef123456';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  // Helper function to create Date with specific time
  const createDate = (baseDate: Date, hours: number, minutes: number) => {
    const d = new Date(baseDate);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  console.log('Seeding Attendance...');
  const attendances = [
    // Dr. Andi - Kemarin (Tepat waktu)
    {
      userId: userIdAndi,
      date: yesterday,
      checkIn: createDate(yesterday, 7, 45),
      checkOut: createDate(yesterday, 16, 5),
      status: AttendanceStatus.PRESENT,
      notes: 'Hadir Tepat Waktu',
    },
    // Dr. Andi - Hari ini (Hadir)
    {
      userId: userIdAndi,
      date: today,
      checkIn: createDate(today, 7, 50),
      checkOut: null, // Masih kerja
      status: AttendanceStatus.PRESENT,
      notes: 'Hadir',
    },

    // Siti Rahmawati - Kemarin (Terlambat)
    {
      userId: userIdSiti,
      date: yesterday,
      checkIn: createDate(yesterday, 8, 30),
      checkOut: createDate(yesterday, 17, 0),
      status: AttendanceStatus.LATE,
      notes: 'Terlambat karena macet',
    },
    // Siti Rahmawati - Hari ini (Tepat Waktu)
    {
      userId: userIdSiti,
      date: today,
      checkIn: createDate(today, 7, 55),
      checkOut: null,
      status: AttendanceStatus.PRESENT,
      notes: 'Aman',
    },

    // Budi Santoso - Dua Hari Lalu (Hadir)
    {
      userId: userIdBudi,
      date: twoDaysAgo,
      checkIn: createDate(twoDaysAgo, 7, 40),
      checkOut: createDate(twoDaysAgo, 16, 0),
      status: AttendanceStatus.PRESENT,
      notes: 'Hadir',
    },
    // Budi Santoso - Kemarin (Cuti Sakit)
    {
      userId: userIdBudi,
      date: yesterday,
      checkIn: createDate(yesterday, 0, 0),
      checkOut: null,
      status: AttendanceStatus.ON_LEAVE,
      notes: 'Cuti Sakit',
    },
    // Budi Santoso - Hari ini (Cuti Sakit)
    {
      userId: userIdBudi,
      date: today,
      checkIn: createDate(today, 0, 0),
      checkOut: null,
      status: AttendanceStatus.ON_LEAVE,
      notes: 'Cuti Sakit',
    }
  ];

  for (const att of attendances) {
    await prisma.attendance.create({ data: att });
  }

  console.log('Seeding Leave Requests...');
  const leaveRequests = [
    {
      userId: userIdBudi,
      startDate: yesterday,
      endDate: today,
      type: LeaveType.SICK,
      reason: 'Tipus, ranap di RS sebelah',
      status: LeaveStatus.APPROVED,
    },
    {
      userId: userIdSiti,
      startDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 Hari dari sekarang
      endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 Hari dari sekarang
      type: LeaveType.ANNUAL,
      reason: 'Pulang kampung',
      status: LeaveStatus.PENDING,
    }
  ];

  for (const lr of leaveRequests) {
    await prisma.leaveRequest.create({ data: lr });
  }

  console.log('Seeding finished successfully! Inserted Dummy Attendance and LeaveRequests.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
