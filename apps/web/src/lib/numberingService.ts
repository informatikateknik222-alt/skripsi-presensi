/**
 * Numbering Management Module
 * Bertugas meng-generate nomor seri/ID secara otomatis dengan format standar Rumah Sakit (Enterprise).
 */

export const NumberingService = {
  /**
   * Mengambil setting penomoran dari localStorage dengan default fallback
   */
  getSettings: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("numbering_settings");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse numbering settings:", e);
        }
      }
    }
    return {
      employee: { prefix: "RS", delimiter: "-", digits: 4 },
      payroll: { prefix: "PAY", delimiter: "-", digits: 4 },
      leave: { prefix: "LV", delimiter: "-", digits: 3 }
    };
  },

  /**
   * Menyimpan setting penomoran ke localStorage
   */
  saveSettings: (settings: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("numbering_settings", JSON.stringify(settings));
    }
  },

  /**
   * Format: RS-{KodeDept}-{Tahun2Digit}-{Urutan}
   * Contoh: RS-HRD-26-0001
   */
  generateEmployeeId: (departmentName: string, count: number): string => {
    const settings = NumberingService.getSettings().employee;
    const year = new Date().getFullYear().toString().slice(-2);
    
    // Ambil 3 huruf awal departemen, jika tidak ada pakai 'GEN' (General)
    const deptCode = departmentName 
      ? departmentName.substring(0, 3).toUpperCase() 
      : 'GEN';
      
    // Pad start memastikan nomor urut selalu sesuai jumlah digit yang diset
    const sequence = count.toString().padStart(settings.digits, '0');

    return `${settings.prefix}${settings.delimiter}${deptCode}${settings.delimiter}${year}${settings.delimiter}${sequence}`;
  },

  /**
   * Format: PAY-{BulanTahun}-{ShortID}
   * Contoh: PAY-052026-A1B2
   * Berguna untuk di Slip Gaji (karena database tidak menyimpan nomor slip secara native)
   */
  generatePayrollSlipNumber: (periodStr: string, userId: string): string => {
    const settings = NumberingService.getSettings().payroll;
    try {
      const date = new Date(periodStr);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear().toString();
      
      // Ambil 4 karakter pertama dari ID Pegawai untuk identifikasi unik
      const shortId = (userId || "0000").substring(0, 4).toUpperCase();

      return `${settings.prefix}${settings.delimiter}${month}${year}${settings.delimiter}${shortId}`;
    } catch {
      return `${settings.prefix}${settings.delimiter}UNKNOWN${settings.delimiter}0000`;
    }
  },

  /**
   * Format: LV-{TahunBulan}-{Urutan}
   * Contoh: LV-202605-001
   */
  generateLeaveRequestId: (count: number): string => {
    const settings = NumberingService.getSettings().leave;
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString();
    const sequence = count.toString().padStart(settings.digits, '0');
    
    return `${settings.prefix}${settings.delimiter}${year}${month}${settings.delimiter}${sequence}`;
  }
};

