const API_BASE_URL = "http://localhost:4002/api";

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const attendanceService = {
  async getAttendance(tab: string) {
    let url = `${API_BASE_URL}/attendance`;
    
    if (tab === "harian") url = `${API_BASE_URL}/attendance/rekap/harian`;
    else if (tab === "mingguan") url = `${API_BASE_URL}/attendance/rekap/mingguan`;
    else if (tab === "bulanan") url = `${API_BASE_URL}/attendance/rekap/bulanan`;

    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) {
      let errorMessage = "Gagal mengambil data kehadiran";
      try {
        const err = await res.json();
        errorMessage = err.message || errorMessage;
      } catch (e) {
        errorMessage = `Error ${res.status}: ${res.statusText || "Layanan tidak merespons"}`;
      }
      throw new Error(errorMessage);
    }
    return res.json();
  },

  async getEmployees() {
    const res = await fetch(`http://localhost:4001/api/employees`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      let errorMessage = "Gagal mengambil data pegawai";
      try {
        const err = await res.json();
        errorMessage = err.message || errorMessage;
      } catch (e) {
        errorMessage = `Error ${res.status}: ${res.statusText || "Layanan tidak merespons"}`;
      }
      throw new Error(errorMessage);
    }
    return res.json();
  },

  async clockInOut() {
    // This is currently a mock in the original page, but I'll define it for future use
    const res = await fetch(`${API_BASE_URL}/attendance/clock`, {
      method: "POST",
      headers: getHeaders()
    });
    return res.json();
  }
};
