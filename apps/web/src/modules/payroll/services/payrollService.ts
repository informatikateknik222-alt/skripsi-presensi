const API_BASE_URL = "http://localhost:4003/api";

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const payrollService = {
  async getRecords() {
    const res = await fetch(`${API_BASE_URL}/payroll-records`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      let errorMessage = "Gagal mengambil data penggajian";
      try {
        const err = await res.json();
        errorMessage = err.message || errorMessage;
      } catch (e) {
        // Fallback to status text if JSON parsing fails
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

  async getEmployeeById(id: string) {
    const res = await fetch(`http://localhost:4001/api/employees/${id}`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    return res.json();
  },

  async createRecord(data: any) {
    const res = await fetch(`${API_BASE_URL}/payroll-records`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Gagal menyimpan data");
    }
    return res.json();
  },

  async updateRecord(id: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/payroll-records/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Gagal memperbarui data");
    }
    return res.json();
  },

  async deleteRecord(id: string) {
    const res = await fetch(`${API_BASE_URL}/payroll-records/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Gagal menghapus data");
    return res.json();
  },

  async getAttendance() {
    const res = await fetch(`http://localhost:4002/api/attendance`, {
      headers: getHeaders()
    });
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
  }
};
