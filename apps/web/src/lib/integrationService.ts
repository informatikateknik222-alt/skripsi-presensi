/**
 * Service ini digunakan untuk mengambil data dari aplikasi/kawan Anda.
 * Ganti 'FRIEND_API_URL' dengan port/URL tempat aplikasi kawan Anda berjalan.
 * Misalnya jika aplikasi kawan Anda berjalan di port 4001: http://localhost:4001/api
 */

const FRIEND_API_URL = process.env.NEXT_PUBLIC_FRIEND_API_URL || "http://localhost:4001/api";

export const integrationService = {
  // 1. Mengambil Data Karyawan
  getEmployees: async () => {
    try {
      const response = await fetch(`${FRIEND_API_URL}/employees`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Jika kawan Anda memakai token
        },
      });
      if (!response.ok) throw new Error("Gagal mengambil data karyawan dari API Kawan");
      return await response.json();
    } catch (error) {
      console.error("Error fetching employees:", error);
      return []; // Return data kosong jika gagal agar aplikasi Anda tidak crash
    }
  },

  // 2. Mengambil Data Shift
  getShifts: async () => {
    try {
      const response = await fetch(`${FRIEND_API_URL}/shifts`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error("Gagal mengambil data shift dari API Kawan");
      return await response.json();
    } catch (error) {
      console.error("Error fetching shifts:", error);
      return [];
    }
  },

  // 3. Mengambil Data Cuti (Berapa yang cuti)
  getLeavesToday: async () => {
    try {
      const response = await fetch(`${FRIEND_API_URL}/leaves/today`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error("Gagal mengambil data cuti dari API Kawan");
      const data = await response.json();
      return data.totalCuti || 0; // Menyesuaikan dengan format JSON dari kawan Anda
    } catch (error) {
      console.error("Error fetching leaves:", error);
      return 0;
    }
  }
};
