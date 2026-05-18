"use client";

import { useEffect, useState } from "react";
import { Plus, CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLeave } from "@/modules/leave/hooks/useLeave";
import { leaveService } from "@/modules/leave/services/leaveService";
import { LeaveTable } from "@/modules/leave/components/LeaveTable";
import { LeaveModal } from "@/modules/leave/components/LeaveModal";
import { LeaveRequest, LeaveFormData } from "@/modules/leave/types/leave.types";

export default function LeavePage() {
  const { riwayatCuti, employees, isLoading, errorMsg, refresh, setRiwayatCuti } = useLeave();
  const [userRole, setUserRole] = useState("EMPLOYEE");
  const [activeTab, setActiveTab] = useState("riwayat");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingEmployee, setIsFetchingEmployee] = useState(false);
  const [employeeData, setEmployeeData] = useState<any>(null);

  const [formData, setFormData] = useState<LeaveFormData>({
    idPegawai: "",
    type: "ANNUAL",
    startDate: "",
    endDate: "",
    reason: "",
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

  const handleFetchEmployee = async (id: string) => {
    if (!id) {
      setEmployeeData(null);
      return;
    }
    setIsFetchingEmployee(true);
    try {
      const data = await leaveService.getEmployeeById(id);
      setEmployeeData(data);
    } catch {
      setEmployeeData(null);
    } finally {
      setIsFetchingEmployee(false);
    }
  };

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let attachmentBase64 = undefined;
      if (formData.attachment) {
        attachmentBase64 = await toBase64(formData.attachment);
      }

      await leaveService.createLeaveRequest({
        userId: employeeData?.userId || employeeData?.id,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        type: formData.type,
        reason: formData.reason,
        attachmentBase64
      });

      await refresh();
      setShowForm(false);
      setFormData({ idPegawai: "", type: "ANNUAL", startDate: "", endDate: "", reason: "" });
      setEmployeeData(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!window.confirm(`Konfirmasi ${status === 'APPROVED' ? 'setujui' : 'tolak'} cuti?`)) return;
    try {
      await leaveService.updateLeaveStatus(id, status);
      await refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus data cuti?")) return;
    try {
      await leaveService.deleteLeaveRequest(id);
      setRiwayatCuti(riwayatCuti.filter(c => c.id !== id));
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handlePrintSurat = (cuti: LeaveRequest, action: 'download' | 'print' = 'print') => {
    const emp = employees.find(e => e.id === cuti.userId || e.userId === cuti.userId) || {};
    const doc = new jsPDF();
    const logoUrl = "/logo.png";
    const img = new window.Image();
    img.src = logoUrl;
    
    const drawContent = (doc: jsPDF, startY: number) => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("SURAT PENGAJUAN CUTI PEGAWAI", 105, startY, { align: "center" });
      
      startY += 15;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Nama: ${emp.name || cuti.userId}`, 14, startY);
      doc.text(`ID Pegawai: ${emp.id_pegawai || '-'}`, 14, startY + 6);
      doc.text(`Jenis Cuti: ${cuti.type}`, 14, startY + 12);
      doc.text(`Periode: ${new Date(cuti.startDate).toLocaleDateString()} - ${new Date(cuti.endDate).toLocaleDateString()}`, 14, startY + 18);
      
      const reasonLines = doc.splitTextToSize(`Alasan: ${cuti.reason}`, 180);
      doc.text(reasonLines, 14, startY + 24);

      if (action === 'print') {
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
      } else {
        doc.save(`Surat_Cuti_${emp.id_pegawai || 'LOG'}.pdf`);
      }
    };

    img.onload = () => {
      doc.addImage(img, 'PNG', 14, 12, 20, 20);
      doc.text("RS EFARINA ETAHAM KARAWANG", 105, 18, { align: "center" });
      doc.line(14, 34, 196, 34);
      drawContent(doc, 45);
    };
    img.onerror = () => drawContent(doc, 20);
  };

  const totalKuota = 12;
  const cutiTerpakai = riwayatCuti
    .filter(c => c.status === "APPROVED" && c.type === "ANNUAL")
    .reduce((total, c) => {
       const start = new Date(c.startDate);
       const end = new Date(c.endDate);
       return total + Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    }, 0);
  const sisaCuti = Math.max(0, totalKuota - cutiTerpakai);

  return (
    <div className="space-y-6 relative transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Manajemen Cuti</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola pengajuan cuti dan izin operasional RS Efarina.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/20">
          <Plus size={20} /> Ajukan Cuti Baru
        </button>
      </div>

      {userRole === "EMPLOYEE" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 p-4 rounded-xl"><CalendarDays size={28} /></div>
            <div><p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Kuota</p><h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalKuota} Hari</h3></div>
          </div>
          <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 p-4 rounded-xl"><Clock size={28} /></div>
            <div><p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sisa Cuti</p><h3 className="text-2xl font-bold text-slate-900 dark:text-white">{sisaCuti} Hari</h3></div>
          </div>
          <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl"><CheckCircle2 size={28} /></div>
            <div><p className="text-sm font-medium text-slate-500 dark:text-slate-400">Terpakai</p><h3 className="text-2xl font-bold text-slate-900 dark:text-white">{cutiTerpakai} Hari</h3></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total</p><h4 className="text-xl font-bold text-slate-900 dark:text-white">{riwayatCuti.length}</h4></div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Pending</p><h4 className="text-xl font-bold text-amber-600 dark:text-amber-400">{riwayatCuti.filter(c => c.status === "PENDING").length}</h4></div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Approved</p><h4 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{riwayatCuti.filter(c => c.status === "APPROVED").length}</h4></div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><p className="text-xs text-rose-600 dark:text-rose-400 mb-1">Rejected</p><h4 className="text-xl font-bold text-rose-600 dark:text-rose-400">{riwayatCuti.filter(c => c.status === "REJECTED").length}</h4></div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 px-6 pt-6 flex gap-6">
          <button onClick={() => setActiveTab("riwayat")} className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === "riwayat" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}>
            Riwayat Cuti {activeTab === "riwayat" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
          </button>
          <button onClick={() => setActiveTab("kebijakan")} className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === "kebijakan" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}>
            Kebijakan {activeTab === "kebijakan" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
          </button>
        </div>

        <div className="p-6">
          {activeTab === "riwayat" ? (
            <LeaveTable 
              riwayatCuti={riwayatCuti}
              employees={employees}
              isLoading={isLoading}
              errorMsg={errorMsg}
              userRole={userRole}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
              onPrint={handlePrintSurat}
            />
          ) : (
            <div className="prose dark:prose-invert prose-sm">
              <h3 className="text-slate-900 dark:text-white">Informasi & Kebijakan Cuti</h3>
              <ul className="text-slate-600 dark:text-slate-400 space-y-2">
                <li>Hak cuti tahunan adalah 12 hari per tahun.</li>
                <li>Pengajuan maksimal H-7 sebelum keberangkatan.</li>
                <li>Sakit &gt; 1 hari wajib upload surat dokter.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <LeaveModal 
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isFetchingEmployee={isFetchingEmployee}
        employeeData={employeeData}
        onFetchEmployee={handleFetchEmployee}
        riwayatCuti={riwayatCuti}
      />
    </div>
  );
}
