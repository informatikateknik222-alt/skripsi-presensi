"use client";

import { useEffect, useState, useRef } from "react";
import { UserPlus, Search, Loader2, X, Building, Briefcase, Mail, Phone, User, Calendar, Edit2, Trash2, Upload } from "lucide-react";
import * as XLSX from 'xlsx';

interface Department {
  id: string;
  name: string;
}

interface Position {
  id: string;
  name: string;
}

interface Employee {
  id?: string;
  id_pegawai?: string;
  name: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
  positionId: string;
  department: { name: string };
  position: { name: string };
  joinDate: string;
}

export default function EmployeesPage() {
  const [userRole, setUserRole] = useState("EMPLOYEE");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState("");
  
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    id_pegawai: "",
    name: "",
    email: "",
    phoneNumber: "",
    departmentId: "",
    positionId: "",
    joinDate: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
  });

  useEffect(() => {
    // Load Role
    const saved = localStorage.getItem("user_info");
    if (saved) {
      try {
        const info = JSON.parse(saved);
        if (info.role) setUserRole(info.role);
      } catch (e) {}
    }

    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const headers = { "Authorization": `Bearer ${token}` };

      // Fetch Employees, Departments, Positions in parallel
      const [resEmp, resDep, resPos] = await Promise.all([
        fetch("http://localhost:4000/api/employees", { headers }),
        fetch("http://localhost:4000/api/departments", { headers }),
        fetch("http://localhost:4000/api/positions", { headers }),
      ]);

      if (!resEmp.ok) {
        if (resEmp.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_info");
          window.location.href = "/login";
          return;
        }
        let errorText = "Gagal mengambil data.";
        try {
          const errData = await resEmp.json();
          errorText = errData.message || `Server Error ${resEmp.status}`;
        } catch(e) {
          errorText = `Server Error ${resEmp.status}`;
        }
        throw new Error(errorText);
      }

      const [dataEmp, dataDep, dataPos] = await Promise.all([
        resEmp.json(),
        resDep.json(),
        resPos.json(),
      ]);

      setEmployees(dataEmp);
      setDepartments(dataDep);
      setPositions(dataPos);
      
      // Set default form values if data exists
      if (dataDep.length > 0 && dataPos.length > 0) {
        setFormData(prev => ({
          ...prev,
          departmentId: dataDep[0].id,
          positionId: dataPos[0].id
        }));
      }

    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      
      const payload = {
        id_pegawai: formData.id_pegawai,
        userId: `u-custom-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        joinDate: new Date(formData.joinDate).toISOString(),
        department: { connect: { id: formData.departmentId } },
        position: { connect: { id: formData.positionId } }
      };

      const res = await fetch("http://localhost:4000/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menambahkan pegawai");
      }

      await fetchInitialData();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (emp: Employee) => {
    const employeeId = emp.id_pegawai || emp.id || "";
    setEditingEmployeeId(employeeId);
    setFormData({
      id_pegawai: employeeId,
      name: emp.name,
      email: emp.email,
      phoneNumber: emp.phoneNumber || "",
      departmentId: emp.departmentId,
      positionId: emp.positionId,
      joinDate: new Date(emp.joinDate).toISOString().split('T')[0]
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      const payload = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        joinDate: new Date(formData.joinDate).toISOString(),
        department: { connect: { id: formData.departmentId } },
        position: { connect: { id: formData.positionId } }
      };

      const res = await fetch(`http://localhost:4000/api/employees/${editingEmployeeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal memperbarui pegawai");
      }

      await fetchInitialData();
      setIsEditModalOpen(false);
      resetForm();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus pegawai "${name}"?`)) return;
    
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:4000/api/employees/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menghapus pegawai");
      }

      // Hapus dari state secara optimis
      setEmployees(employees.filter(emp => (emp.id_pegawai || emp.id) !== id));
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        throw new Error("File Excel kosong atau format tidak sesuai.");
      }

      const token = localStorage.getItem("access_token");
      let successCount = 0;
      let errorCount = 0;

      for (const row of jsonData) {
        try {
          const idPegawai = row["ID Pegawai"] || row["ID PEGAWAI"] || row["id_pegawai"];
          const name = row["Nama"] || row["NAMA"] || row["name"];
          const email = row["Email"] || row["EMAIL"] || row["email"];
          const phoneNumber = row["No HP"] || row["NO HP"] || row["phoneNumber"] || "";
          const deptName = row["Departemen"] || row["DEPARTEMEN"] || row["department"];
          const posName = row["Jabatan"] || row["JABATAN"] || row["position"];
          const joinDateRaw = row["Tanggal Bergabung"] || row["TANGGAL BERGABUNG"] || row["joinDate"];

          if (!name || !email) continue; 

          const deptMatch = departments.find(d => d.name.toLowerCase() === String(deptName).toLowerCase());
          const posMatch = positions.find(p => p.name.toLowerCase() === String(posName).toLowerCase());

          const deptId = deptMatch ? deptMatch.id : departments[0]?.id;
          const posId = posMatch ? posMatch.id : positions[0]?.id;

          let parsedDate = new Date();
          if (typeof joinDateRaw === 'number') {
            parsedDate = new Date(Math.round((joinDateRaw - 25569) * 86400 * 1000));
          } else if (typeof joinDateRaw === 'string') {
            parsedDate = new Date(joinDateRaw);
          }

          if (!deptId || !posId) {
            throw new Error("Data Departemen atau Jabatan di sistem kosong.");
          }

          const payload = {
            id_pegawai: String(idPegawai || `PEG-IMPORT-${Date.now().toString().slice(-4)}`),
            userId: `u-import-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: String(name),
            email: String(email),
            phoneNumber: String(phoneNumber),
            joinDate: parsedDate.toISOString(),
            department: { connect: { id: deptId } },
            position: { connect: { id: posId } }
          };

          const res = await fetch("http://localhost:4000/api/employees", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });

          if (res.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (err) {
          errorCount++;
        }
      }

      alert(`Import selesai!\nBerhasil: ${successCount}\nGagal/Dilewati: ${errorCount}`);
      await fetchInitialData();
      
    } catch (err: any) {
      alert("Error saat memproses Excel: " + err.message);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setFormData({
      id_pegawai: "",
      name: "",
      email: "",
      phoneNumber: "",
      departmentId: departments[0]?.id || "",
      positionId: positions[0]?.id || "",
      joinDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Direktori Pegawai</h1>
          <p className="text-slate-400 mt-1">Daftar lengkap anggota organik medis dan non-medis RS Efarina.</p>
        </div>
        
        {/* Tombol Tambah & Import hanya untuk ADMIN atau SDM */}
        {(userRole === "ADMIN" || userRole === "SDM") && (
          <div className="flex items-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm active:scale-95 disabled:opacity-70"
            >
              {isImporting ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              {isImporting ? "Mengimpor..." : "Import Excel"}
            </button>
            <button 
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500/100 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <UserPlus size={18} />
              Tambah Pegawai
            </button>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-700 overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
          <div className="relative w-full max-w-sm group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500">
              <Search size={16} />
            </div>
            <input
              type="text"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              placeholder="Cari nama atau email..."
            />
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center text-indigo-400 gap-3">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm">Memuat data pegawai...</p>
            </div>
          ) : errorMsg ? (
            <div className="h-64 flex items-center justify-center text-rose-400 text-sm">
              {errorMsg}
            </div>
          ) : employees.length === 0 ? (
             <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              Belum ada data pegawai terdaftar.
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-900/50 text-slate-400 border-b border-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">ID Pegawai</th>
                  <th scope="col" className="px-6 py-4 font-medium">Nama Pegawai</th>
                  <th scope="col" className="px-6 py-4 font-medium">Kontak</th>
                  <th scope="col" className="px-6 py-4 font-medium">Divisi & Pangkat</th>
                  {(userRole === "ADMIN" || userRole === "SDM") && (
                    <th scope="col" className="px-6 py-4 font-medium text-right">Tindakan</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {employees.map((emp) => {
                  const empId = emp.id_pegawai || emp.id;
                  return (
                  <tr key={empId} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-slate-300">{empId || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{emp.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Bergabung: {new Date(emp.joinDate).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">{emp.email}</div>
                      <div className="text-xs text-slate-400">{emp.phoneNumber || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-400 border border-emerald-200">
                          {emp.department?.name || 'Unknown'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-400 border border-amber-200">
                          {emp.position?.name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    {(userRole === "ADMIN" || userRole === "SDM") && (
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => handleEditClick(emp)}
                          className="p-2 text-slate-400 hover:text-indigo-400 transition-colors rounded-lg hover:bg-indigo-500/10"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteEmployee(empId || "", emp.name)}
                          className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/10"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Tambah / Edit Pegawai */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => isModalOpen ? setIsModalOpen(false) : setIsEditModalOpen(false)}></div>
          
          <div className="relative bg-slate-800 w-full max-w-lg rounded-2xl shadow-xl border border-slate-700 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between sticky top-0 bg-slate-800 rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {isModalOpen ? <UserPlus size={20} className="text-indigo-400" /> : <Edit2 size={20} className="text-indigo-400" />}
                {isModalOpen ? 'Tambah Pegawai Baru' : 'Edit Data Pegawai'}
              </h2>
              <button onClick={() => isModalOpen ? setIsModalOpen(false) : setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="employeeForm" onSubmit={isModalOpen ? handleAddEmployee : handleUpdateEmployee} className="space-y-5">
                
                {isModalOpen && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">ID Pegawai</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><User size={16} /></div>
                      <input type="text" required value={formData.id_pegawai} onChange={e => setFormData({...formData, id_pegawai: e.target.value})}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        placeholder="Contoh: PEG-001" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Nama Lengkap & Gelar</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><User size={16} /></div>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      placeholder="dr. Budi Santoso, Sp.PD" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Mail size={16} /></div>
                      <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        placeholder="budi@rsefarina.test" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">No. WhatsApp</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Phone size={16} /></div>
                      <input type="tel" required value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        placeholder="081234567890" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Departemen / Unit</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Building size={16} /></div>
                      <select required value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none">
                        {departments.map(d => <option key={d.id} value={d.id} className="bg-slate-800/80 backdrop-blur-sm">{d.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Jabatan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Briefcase size={16} /></div>
                      <select required value={formData.positionId} onChange={e => setFormData({...formData, positionId: e.target.value})}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none">
                        {positions.map(p => <option key={p.id} value={p.id} className="bg-slate-800/80 backdrop-blur-sm">{p.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Tanggal Bergabung</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Calendar size={16} /></div>
                    <input type="date" required value={formData.joinDate} onChange={e => setFormData({...formData, joinDate: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-slate-700/50 bg-slate-900/50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0 z-10">
              <button type="button" onClick={() => isModalOpen ? setIsModalOpen(false) : setIsEditModalOpen(false)} disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-slate-900 hover:bg-slate-200 transition-colors">
                Batal
              </button>
              <button type="submit" form="employeeForm" disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500/100 disabled:bg-indigo-600/50 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : isModalOpen ? <UserPlus size={18} /> : <Edit2 size={18} />}
                {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
