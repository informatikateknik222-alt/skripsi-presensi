const EMPLOYEE_API_URL = "http://localhost:4001/api";
const ATTENDANCE_API_URL = "http://localhost:4002/api";
const PAYROLL_API_URL = "http://localhost:4003/api";

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Authorization": `Bearer ${token}`
  };
};

export const dashboardService = {
  async getAdminStats() {
    const [empRes, attHarianRes] = await Promise.all([
      fetch(`${EMPLOYEE_API_URL}/employees`, { headers: getHeaders() }).catch(() => null),
      fetch(`${ATTENDANCE_API_URL}/attendance/rekap/harian`, { headers: getHeaders() }).catch(() => null)
    ]);

    let totalPegawai = 0;
    if (empRes?.ok) {
      const data = await empRes.json();
      totalPegawai = Array.isArray(data) ? data.length : 0;
    }

    let summary = { totalHadir: 0, totalTelat: 0, totalCuti: 0 };
    if (attHarianRes?.ok) {
      const data = await attHarianRes.json();
      if (data.summary) summary = data.summary;
    }

    return {
      totalPegawai,
      hadirHariIni: summary.totalHadir,
      terlambat: summary.totalTelat,
      sedangCuti: summary.totalCuti
    };
  },

  async getKeuanganStats() {
    const res = await fetch(`${PAYROLL_API_URL}/payroll-records`, { headers: getHeaders() }).catch(() => null);
    let stats = { totalPaid: 0, paidCount: 0, pendingCount: 0 };

    if (res?.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach((r: any) => {
          if (r.status === "PAID") {
            stats.totalPaid += parseFloat(r.netSalary || 0);
            stats.paidCount += 1;
          } else {
            stats.pendingCount += 1;
          }
        });
      }
    }
    return stats;
  },

  async getRecentActivities() {
    const res = await fetch(`${ATTENDANCE_API_URL}/attendance`, { headers: getHeaders() }).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
      }
    }
    return [];
  },
  async getWeeklyAttendance() {
    const res = await fetch(`${ATTENDANCE_API_URL}/attendance/rekap/mingguan`, { headers: getHeaders() }).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data; // should return array of { day: string, total: number } or similar
      }
    }
    return [0, 0, 0, 0, 0, 0, 0]; // Default fallback if empty
  }
};
