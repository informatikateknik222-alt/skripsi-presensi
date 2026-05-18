const API_BASE_URL = "http://localhost:4001/api";

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const employeeService = {
  async getEmployees() {
    const res = await fetch(`${API_BASE_URL}/employees`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Gagal mengambil data pegawai");
    return res.json();
  },

  async getDepartments() {
    const res = await fetch(`${API_BASE_URL}/departments`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Gagal mengambil data departemen");
    return res.json();
  },

  async getPositions() {
    const res = await fetch(`${API_BASE_URL}/positions`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Gagal mengambil data jabatan");
    return res.json();
  },

  async createEmployee(payload: any) {
    const res = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Gagal menambahkan pegawai");
    }
    return res.json();
  },

  async updateEmployee(id: string, payload: any) {
    const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Gagal memperbarui pegawai");
    }
    return res.json();
  },

  async deleteEmployee(id: string) {
    const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Gagal menghapus pegawai");
    }
    return true;
  }
};
