@echo off
echo Mendorong schema ke database presensi...

echo [1/3] Memproses Employee Service...
call npx prisma db push --schema=apps/employee/prisma/schema.prisma

echo [2/3] Memproses Attendance (termasuk Cuti/Leave)...
call npx prisma db push --schema=apps/attendance/prisma/schema.prisma

echo [3/3] Memproses Payroll Service...
call npx prisma db push --schema=apps/payroll/prisma/schema.prisma

echo Selesai! Tabel berhasil dibuat di database presensi.
pause
