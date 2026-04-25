import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { FingerspotWebhookDto } from './dto/fingerspot-webhook.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AttendanceCreateInput) {
    return this.prisma.attendance.create({ data });
  }

  async findAll() {
    return this.prisma.attendance.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.attendance.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Attendance record not found');
    return record;
  }

  async update(id: string, data: Prisma.AttendanceUpdateInput) {
    await this.findOne(id);
    return this.prisma.attendance.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.attendance.delete({ where: { id } });
  }

  // --- FINGERSPOT INTEGRATION ---
  
  async processFingerspotWebhook(payload: FingerspotWebhookDto | FingerspotWebhookDto[]) {
    // Payload bisa array (multiple scan) atau single object
    const scans = Array.isArray(payload) ? payload : [payload];
    const results: any[] = [];

    for (const scan of scans) {
      if (!scan.pin || !scan.scan_time) continue;

      const userId = scan.pin; // Di sistem kita, PIN mesin disamakan dengan ID Pegawai (atau userId)
      const scanDateObj = new Date(scan.scan_time);
      
      // Ambil tanggal saja untuk mengecek apakah sudah ada attendance hari ini
      const startOfDay = new Date(scanDateObj);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(scanDateObj);
      endOfDay.setHours(23, 59, 59, 999);

      // Cari rekor attendance hari ini untuk user tersebut
      const existingRecord = await this.prisma.attendance.findFirst({
        where: {
          userId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          }
        }
      });

      if (!existingRecord) {
        // Belum ada, berarti ini Check-In
        // Tentukan status (misal Shift jam 08:00)
        let status: 'PRESENT' | 'LATE' = 'PRESENT';
        if (scanDateObj.getHours() >= 8 && scanDateObj.getMinutes() > 0) {
          status = 'LATE';
        }

        const newRecord = await this.prisma.attendance.create({
          data: {
            userId,
            date: scanDateObj, // Atau startOfDay
            checkIn: scanDateObj,
            status: status,
            notes: 'Fingerspot Webhook'
          }
        });
        results.push({ action: 'check-in', record: newRecord });
      } else {
        // Sudah ada, berarti ini kemungkinan Check-Out
        // Cek selisih waktu untuk mencegah double scan berdekatan (misal < 5 menit)
        const timeDiffMinutes = (scanDateObj.getTime() - new Date(existingRecord.checkIn).getTime()) / 60000;
        
        if (timeDiffMinutes > 5) {
          const updatedRecord = await this.prisma.attendance.update({
            where: { id: existingRecord.id },
            data: {
              checkOut: scanDateObj
            }
          });
          results.push({ action: 'check-out', record: updatedRecord });
        } else {
          results.push({ action: 'ignored-duplicate', userId });
        }
      }
    }
    return { success: true, processed: results.length, data: results };
  }

  // --- REKAPITULASI ---

  async getRekapHarian(dateStr?: string) {
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const attendances = await this.prisma.attendance.findMany({
      where: {
        date: { gte: targetDate, lte: endOfDay }
      }
    });

    const summary = {
      totalHadir: attendances.filter(a => a.status === 'PRESENT').length,
      totalTelat: attendances.filter(a => a.status === 'LATE').length,
      totalAbsen: attendances.filter(a => a.status === 'ABSENT').length,
      totalCuti: attendances.filter(a => a.status === 'ON_LEAVE').length,
    };

    return { date: targetDate, summary, data: attendances };
  }

  async getRekapMingguan(startDateStr?: string) {
    const startDate = startDateStr ? new Date(startDateStr) : new Date();
    startDate.setHours(0, 0, 0, 0);
    
    // Asumsi seminggu adalah 7 hari dari startDate
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 999);

    const attendances = await this.prisma.attendance.findMany({
      where: {
        date: { gte: startDate, lte: endDate }
      }
    });

    const summary = {
      totalHadir: attendances.filter(a => a.status === 'PRESENT').length,
      totalTelat: attendances.filter(a => a.status === 'LATE').length,
      totalAbsen: attendances.filter(a => a.status === 'ABSENT').length,
      totalCuti: attendances.filter(a => a.status === 'ON_LEAVE').length,
    };

    return { period: { start: startDate, end: endDate }, summary, data: attendances };
  }

  async getRekapBulanan(monthStr?: string, yearStr?: string) {
    const current = new Date();
    const month = monthStr ? parseInt(monthStr) - 1 : current.getMonth();
    const year = yearStr ? parseInt(yearStr) : current.getFullYear();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Hari terakhir bulan tsb
    endDate.setHours(23, 59, 59, 999);

    const attendances = await this.prisma.attendance.findMany({
      where: {
        date: { gte: startDate, lte: endDate }
      }
    });

    const summary = {
      totalHadir: attendances.filter(a => a.status === 'PRESENT').length,
      totalTelat: attendances.filter(a => a.status === 'LATE').length,
      totalAbsen: attendances.filter(a => a.status === 'ABSENT').length,
      totalCuti: attendances.filter(a => a.status === 'ON_LEAVE').length,
    };

    return { period: { month: month + 1, year }, summary, data: attendances };
  }
}
