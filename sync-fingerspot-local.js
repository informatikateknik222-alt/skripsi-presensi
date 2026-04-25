const axios = require('axios');
const mysql = require('mysql2/promise'); // Jika menggunakan mysql asli (Anda harus jalankan: yarn add mysql2)

/**
 * Script ini digunakan jika Anda menarik data dari database lokal (MySQL/Access)
 * milik software bawaan Fingerspot (seperti FTM / Personnel).
 * 
 * Cara Penggunaan:
 * 1. Install mysql2 jika database fingerspot adalah MySQL: npm install mysql2 axios
 * 2. Sesuaikan konfigurasi database lokal di bawah.
 * 3. Jalankan menggunakan scheduler (cron job di Linux / Task Scheduler di Windows) setiap X menit.
 *    Perintah: node sync-fingerspot-local.js
 */

const FINGERSPOT_DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fingerspot_db' // Ganti dengan nama database bawaan fingerspot
};

// URL API Gateway kita (meneruskan ke attendance-service/fingerspot/webhook)
const WEBHOOK_URL = 'http://localhost:4000/api/attendance/fingerspot/webhook';

async function syncAttendance() {
  let connection;
  try {
    console.log('[SYNC] Menghubungkan ke database lokal Fingerspot...');
    connection = await mysql.createConnection(FINGERSPOT_DB_CONFIG);

    // Ambil data log presensi hari ini (Sesuaikan nama tabel dan kolom dengan struktur asli Fingerspot Anda)
    // Contoh umum pada FTM: tabel `tc_log` atau `att_log`
    const query = `
      SELECT pin, scan_date 
      FROM att_log 
      WHERE DATE(scan_date) = CURDATE()
    `;
    
    const [rows] = await connection.execute(query);
    console.log(`[SYNC] Ditemukan ${rows.length} log presensi hari ini.`);

    if (rows.length === 0) {
      console.log('[SYNC] Tidak ada data baru untuk disinkronkan.');
      return;
    }

    // Format data sesuai dengan DTO Webhook kita
    const payloads = rows.map(row => ({
      pin: row.pin.toString(),
      scan_time: row.scan_date // Format datetime YYYY-MM-DD HH:MM:SS
    }));

    console.log('[SYNC] Mengirim data ke API Presensi kita...');
    
    const response = await axios.post(WEBHOOK_URL, payloads);
    console.log('[SYNC] Berhasil!', response.data);

  } catch (error) {
    console.error('[SYNC ERROR] Gagal melakukan sinkronisasi:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Eksekusi
syncAttendance();
