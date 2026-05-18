"use client";

import { useEffect, useState, useRef } from "react";
import { UserPlus, Loader2, Upload } from "lucide-react";
import { useEmployees } from "@/modules/employees/hooks/useEmployees";
import { employeeService } from "@/modules/employees/services/employeeService";
import { importService } from "@/modules/employees/services/importService";
import { EmployeeTable } from "@/modules/employees/components/EmployeeTable";
import { EmployeeModal } from "@/modules/employees/components/EmployeeModal";
import { EmployeeStats } from "@/modules/employees/components/EmployeeStats";
import { Employee, EmployeeFormData } from "@/modules/employees/types/employee.types";
import { FileDown } from "lucide-react";

export default function EmployeesPage() {
  const {
    employees,
    departments,
    positions,
    isLoading,
    errorMsg,
    stats,
    refresh,
    setEmployees
  } = useEmployees();

  const [userRole, setUserRole] = useState("EMPLOYEE");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<EmployeeFormData>({
    id_pegawai: "",
    name: "",
    email: "",
    phoneNumber: "",
    departmentId: "",
    positionId: "",
    joinDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const saved = localStorage.getItem("user_info");
    if (saved) {
      try {
        const info = JSON.parse(saved);
        if (info.role) setUserRole(info.role);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (departments.length > 0 && positions.length > 0 && !formData.departmentId) {
      setFormData(prev => ({
        ...prev,
        departmentId: departments[0].id,
        positionId: positions[0].id
      }));
    }
  }, [departments, positions, formData.departmentId]);

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

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditClick = (emp: Employee) => {
    const employeeId = emp.id_pegawai || emp.id || "";
    setEditingEmployeeId(employeeId);
    setIsEditMode(true);
    setFormData({
      id_pegawai: employeeId,
      name: emp.name,
      email: emp.email,
      phoneNumber: emp.phoneNumber || "",
      departmentId: emp.departmentId,
      positionId: emp.positionId,
      joinDate: new Date(emp.joinDate).toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        id_pegawai: formData.id_pegawai,
        userId: isEditMode ? undefined : `u-custom-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        joinDate: new Date(formData.joinDate).toISOString(),
        department: { connect: { id: formData.departmentId } },
        position: { connect: { id: formData.positionId } }
      };

      if (isEditMode) {
        await employeeService.updateEmployee(editingEmployeeId, payload);
      } else {
        await employeeService.createEmployee(payload);
      }

      await refresh();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Hapus pegawai "${name}"?`)) return;
    try {
      await employeeService.deleteEmployee(id);
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
      const result = await importService.importEmployeesFromExcel(file, departments, positions);
      alert(`Import selesai! Berhasil: ${result.success}, Gagal: ${result.error}`);
      await refresh();
    } catch (err: any) {
      alert("Error Import: " + err.message);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 relative transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Direktori Pegawai</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Daftar lengkap anggota organik medis dan non-medis RS Efarina.</p>
        </div>
        
        {(userRole === "ADMIN" || userRole === "SDM") && (
          <div className="flex items-center gap-3">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls, .csv" className="hidden" />
            <button 
              onClick={() => importService.exportEmployeesToExcel(employees)}
              className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl font-medium transition-all border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95"
            >
              <FileDown size={18} />
              Export
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm active:scale-95 disabled:opacity-70"
            >
              {isImporting ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              {isImporting ? "Mengimpor..." : "Import"}
            </button>
            <button 
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg active:scale-95"
            >
              <UserPlus size={18} />
              Tambah Pegawai
            </button>
          </div>
        )}
      </div>

      <EmployeeStats stats={stats} isLoading={isLoading} />

      <EmployeeTable 
        employees={employees}
        isLoading={isLoading}
        errorMsg={errorMsg}
        userRole={userRole}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <EmployeeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        formData={formData}
        setFormData={setFormData}
        departments={departments}
        positions={positions}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
