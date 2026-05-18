const ATTENDANCE_API_URL = "http://localhost:4002/api";
const EMPLOYEE_API_URL = "http://localhost:4001/api";

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const leaveService = {
  async getLeaveRequests() {
    const res = await fetch(`${ATTENDANCE_API_URL}/leave-requests`, { headers: getHeaders() });
    if (!res.ok) {
      let errorMessage = "Gagal mengambil data cuti";
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

  async createLeaveRequest(payload: any) {
    const res = await fetch(`${ATTENDANCE_API_URL}/leave-requests`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      let errorMessage = "Gagal mengajukan cuti";
      try {
        const err = await res.json();
        errorMessage = err.message || errorMessage;
      } catch (e) {
        errorMessage = `Error ${res.status}: ${res.statusText || "Gagal menyimpan data"}`;
      }
      throw new Error(errorMessage);
    }
    return res.json();
  },

  async updateLeaveStatus(id: string, status: string) {
    const res = await fetch(`${ATTENDANCE_API_URL}/leave-requests/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      let errorMessage = "Gagal memperbarui status cuti";
      try {
        const err = await res.json();
        errorMessage = err.message || errorMessage;
      } catch (e) {
        errorMessage = `Error ${res.status}: ${res.statusText || "Gagal memperbarui data"}`;
      }
      throw new Error(errorMessage);
    }
    return res.json();
  },

  async deleteLeaveRequest(id: string) {
    const res = await fetch(`${ATTENDANCE_API_URL}/leave-requests/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Gagal menghapus cuti");
    return true;
  },

  async getEmployees() {
    const res = await fetch(`${EMPLOYEE_API_URL}/employees`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Gagal mengambil data pegawai");
    return res.json();
  },

  async getEmployeeById(id: string) {
    const res = await fetch(`${EMPLOYEE_API_URL}/employees/${id}`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    return res.json();
  }
};
