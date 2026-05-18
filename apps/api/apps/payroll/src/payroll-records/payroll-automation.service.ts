import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { HttpService } from '@nestjs/axios';
import { PayrollRecordsService } from './payroll-records.service';
// import { firstValueFrom } from 'rxjs';

@Injectable()
export class PayrollAutomationService {
  private readonly logger = new Logger(PayrollAutomationService.name);

  constructor(
    // private readonly httpService: HttpService,
    private readonly payrollRecordsService: PayrollRecordsService,
  ) {}

  // Menjalankan otomatis setiap hari jam 00:00
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleAutomaticPayroll() {
    this.logger.log('Memulai proses hitung gaji otomatis...');
    /*
    try {
      // 1. Ambil data semua pegawai dari Employee Service
      const employeesRes = await firstValueFrom(
        this.httpService.get('http://localhost:4001/api/employees')
      );
      const employees = employeesRes.data;

      // 2. Ambil data kehadiran dari Attendance Service
      const attendanceRes = await firstValueFrom(
        this.httpService.get('http://localhost:4002/api/attendance')
      );
      const attendance = attendanceRes.data;

      const currMonth = new Date().getMonth();
      const currYear = new Date().getFullYear();
      const periodStr = new Date(currYear, currMonth, 1).toISOString();

      this.logger.log(`Memproses gaji untuk periode: ${periodStr}`);

      for (const emp of employees) {
        // Filter absensi bulan ini untuk pegawai ini
        const userAtt = attendance.filter(a => {
          const d = new Date(a.date);
          return (a.userId === emp.userId || a.userId === emp.id_pegawai || a.userId === emp.id) &&
                 d.getMonth() === currMonth && d.getFullYear() === currYear;
        });

        const totalHadir = userAtt.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
        const totalTelat = userAtt.filter(a => a.status === 'LATE').length;

        // Logika Hitung Gaji
        const basicSalary = 4000000; // Bisa diambil dari DB Salary jika ada
        const totalAllowance = totalHadir * 50000;
        const potonganTelat = totalTelat * 25000;
        const bpjsDeduction = basicSalary * 0.03;
        const taxDeduction = basicSalary * 0.05;
        const netSalary = basicSalary + totalAllowance - potonganTelat - bpjsDeduction - taxDeduction;

        // Simpan atau Update Record
        await this.payrollRecordsService.upsertAutomaticRecord({
          userId: emp.userId || emp.id_pegawai || emp.id,
          period: periodStr,
          basicSalary,
          totalAllowance,
          totalDeduction: potonganTelat,
          bpjsDeduction,
          taxDeduction,
          netSalary,
          status: 'DRAFT'
        });
      }

      this.logger.log('Proses hitung gaji otomatis selesai dengan sukses.');
    } catch (error) {
      this.logger.error('Gagal menjalankan hitung gaji otomatis', error.stack);
    }
    */
  }
}
