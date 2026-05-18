import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AttendanceService } from './attendance.service';
// import * as mysql from 'mysql2/promise'; // Commented out to prevent crash if not installed

@Injectable()
export class FingerspotSyncService {
  private readonly logger = new Logger(FingerspotSyncService.name);

  constructor(private readonly attendanceService: AttendanceService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    this.logger.debug('Starting Fingerspot data synchronization...');
    await this.syncFromFingerspot();
  }

  async syncFromFingerspot() {
    let connection;
    try {
      // Dynamic import to prevent crash if mysql2 is not installed
      const mysql = await import('mysql2/promise');
      
      // Konfigurasi ini sebaiknya diletakkan di .env
      const dbConfig = {
        host: process.env.FINGERSPOT_DB_HOST || 'localhost',
        user: process.env.FINGERSPOT_DB_USER || 'root',
        password: process.env.FINGERSPOT_DB_PASSWORD || '',
        database: process.env.FINGERSPOT_DB_NAME || 'fingerspot_db',
      };

      this.logger.log(`Connecting to Fingerspot DB at ${dbConfig.host}...`);
      connection = await mysql.createConnection(dbConfig);

      // Ambil data log presensi hari ini
      const query = `
        SELECT pin, scan_date 
        FROM att_log 
        WHERE DATE(scan_date) = CURDATE()
      `;
      
      const [rows]: [any[], any] = await connection.execute(query);
      this.logger.log(`Found ${rows.length} attendance logs for today.`);

      if (rows.length === 0) return;

      // Format data untuk diproses oleh AttendanceService
      const payloads = rows.map(row => ({
        pin: row.pin.toString(),
        scan_time: row.scan_date
      }));

      // Panggil method existing di AttendanceService
      const result = await this.attendanceService.processFingerspotWebhook(payloads);
      this.logger.log(`Sync complete: ${result.processed} records processed.`);

    } catch (error) {
      this.logger.error(`Failed to sync from Fingerspot: ${error.message}`);
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }
}
