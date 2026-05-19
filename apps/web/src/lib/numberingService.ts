/**
 * Numbering Management Module
 * Bertugas meng-generate nomor seri/ID secara otomatis dengan format standar Rumah Sakit (Enterprise).
 */

export const NumberingService = {
  /**
   * Format: RS-{KodeDept}-{Tahun2Digit}-{Urutan}
   * Contoh: RS-HRD-26-0001
   */
  generateEmployeeId: (departmentName: string, count: number): string => {
    const year = new Date().getFullYear().toString().slice(-2);
    
    // Ambil 3 huruf awal departemen, jika tidak ada pakai 'GEN' (General)
    const deptCode = departmentName 
      ? departmentName.substring(0, 3).toUpperCase() 
      : 'GEN';
      
    // Pad start memastikan nomor urut selalu 4 digit (0001, 0012, 0123)
    const sequence = count.toString().padStart(4, '0');

    return `RS-${deptCode}-${year}-${sequence}`;
  },

  /**
   * Format: PAY-{BulanTahun}-{ShortID}
   * Contoh: PAY-052026-A1B2
   * Berguna untuk di Slip Gaji (karena database tidak menyimpan nomor slip secara native)
   */
  generatePayrollSlipNumber: (periodStr: string, userId: string): string => {
    try {
      const date = new Date(periodStr);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear().toString();
      
      // Ambil 4 karakter pertama dari ID Pegawai untuk identifikasi unik
      const shortId = (userId || "0000").substring(0, 4).toUpperCase();

      return `PAY-${month}${year}-${shortId}`;
    } catch {
      return `PAY-UNKNOWN-0000`;
    }
  },

  /**
   * Format: LV-{TahunBulan}-{Urutan}
   * Contoh: LV-202605-001
   */
  generateLeaveRequestId: (count: number): string => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString();
    const sequence = count.toString().padStart(3, '0');
    
    return `LV-${year}${month}-${sequence}`;
  }
};
