"use client";

import { CalendarDays, Plus, Clock, CheckCircle2, XCircle, FileText, X, Loader2, Printer, Trash2, Download } from "lucide-react";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

export default function LeavePage() {
  const [activeTab, setActiveTab] = useState("riwayat");
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [jenisCuti, setJenisCuti] = useState("Cuti Tahunan");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [idPegawai, setIdPegawai] = useState("");
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [isFetchingEmployee, setIsFetchingEmployee] = useState(false);

  const [riwayatCuti, setRiwayatCuti] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [userRole, setUserRole] = useState("EMPLOYEE");

  useEffect(() => {
    const saved = localStorage.getItem("user_info");
    if (saved) {
      try {
        const info = JSON.parse(saved);
        if (info.role) setUserRole(info.role);
      } catch (e) {}
    }
    fetchEmployees();
    fetchLeaveRequests();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:4000/api/employees", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setEmployees(await res.json());
      }
    } catch (e) {}
  };

  const fetchLeaveRequests = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:4000/api/leave-requests", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_info");
          window.location.href = "/login";
          return;
        }
        throw new Error("Gagal mengambil data cuti.");
      }
      
      const data = await res.json();
      setRiwayatCuti(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin ${newStatus === 'APPROVED' ? 'menyetujui' : 'menolak'} cuti ini?`)) return;
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:4000/api/leave-requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Gagal memperbarui status cuti");
      await fetchLeaveRequests();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data cuti ini secara permanen?")) return;
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:4000/api/leave-requests/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Gagal menghapus cuti");
      await fetchLeaveRequests();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handlePrintSurat = (cuti: any, action: 'download' | 'print' = 'print') => {
    const emp = employees.find(e => e.id === cuti.userId || e.userId === cuti.userId) || {};
    const displayName = emp.name || cuti.userId;
    const displayId = emp.id_pegawai || cuti.userId;
    const deptName = emp.department?.name || "-";
    const posName = emp.position?.name || "-";
    
    const doc = new jsPDF();
    const logoUrl = "/logo.png";
    const img = new window.Image();
    img.src = logoUrl;
    
    const dateNow = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const startDate = new Date(cuti.startDate);
    const endDate = new Date(cuti.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
    const typeLabel = cuti.type === "ANNUAL" ? "Cuti Tahunan" : cuti.type === "SICK" ? "Sakit" : cuti.type === "MATERNITY" ? "Cuti Melahirkan" : "Izin Penting";
    const statusLabel = cuti.status === "APPROVED" ? "Disetujui" : cuti.status === "REJECTED" ? "Ditolak" : "Menunggu Persetujuan";

    const drawContent = (doc: jsPDF, startY: number) => {
      // Title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("SURAT PENGAJUAN CUTI PEGAWAI", 105, startY, { align: "center" });
      
      startY += 12;
      
      // Yang bertanda tangan di bawah ini
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Yang bertanda tangan di bawah ini:", 14, startY);
      
      startY += 8;
      
      const startX = 20;
      const colonX = 55;
      const valueX = 58;

      doc.text("Nama", startX, startY); doc.text(":", colonX, startY); doc.setFont("helvetica", "bold"); doc.text(displayName, valueX, startY); doc.setFont("helvetica", "normal");
      doc.text("ID Pegawai", startX, startY + 6); doc.text(":", colonX, startY + 6); doc.text(displayId, valueX, startY + 6);
      doc.text("Departemen / Jabatan", startX, startY + 12); doc.text(":", colonX, startY + 12); doc.text(`${deptName} / ${posName}`, valueX, startY + 12);

      startY += 22;
      
      doc.text("Dengan ini bermaksud untuk mengajukan izin / cuti dengan rincian sebagai berikut:", 14, startY);
      
      startY += 8;

      doc.text("Jenis Cuti", startX, startY); doc.text(":", colonX, startY); doc.setFont("helvetica", "bold"); doc.text(typeLabel, valueX, startY); doc.setFont("helvetica", "normal");
      doc.text("Tanggal Mulai", startX, startY + 6); doc.text(":", colonX, startY + 6); doc.text(startDate.toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'}), valueX, startY + 6);
      doc.text("Tanggal Selesai", startX, startY + 12); doc.text(":", colonX, startY + 12); doc.text(endDate.toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'}), valueX, startY + 12);
      doc.text("Durasi", startX, startY + 18); doc.text(":", colonX, startY + 18); doc.text(`${days} Hari`, valueX, startY + 18);
      doc.text("Alasan / Keperluan", startX, startY + 24); doc.text(":", colonX, startY + 24); 
      
      // Auto wrap reason
      const reasonLines = doc.splitTextToSize(cuti.reason || "-", 135);
      doc.text(reasonLines, valueX, startY + 24);
      
      const finalYAfterReason = startY + 24 + (reasonLines.length * 5);
      
      doc.text("Status Pengajuan", startX, finalYAfterReason + 5); doc.text(":", colonX, finalYAfterReason + 5); doc.setFont("helvetica", "bold"); doc.text(statusLabel, valueX, finalYAfterReason + 5); doc.setFont("helvetica", "normal");

      const finalY = finalYAfterReason + 25;
      
      // Pemohon Signature (Left)
      doc.text("Pemohon,", 50, finalY, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.text(`(${displayName})`, 50, finalY + 25, { align: "center" });

      // HRD Signature (Right)
      doc.setFont("helvetica", "normal");
      doc.text("Karawang, " + dateNow, 160, finalY - 5, { align: "center" });
      doc.text("Mengetahui,", 160, finalY, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.text("HRD RS Efarina Etaham Karawang", 160, finalY + 25, { align: "center" });

      if (cuti.type === "SICK" && days > 1) {
        doc.addPage();
        
        if (cuti.attachmentBase64) {
          try {
            // Tampilkan gambar langsung memenuhi halaman 2
            doc.addImage(cuti.attachmentBase64, 15, 15, 180, 260);
          } catch(e) {
            doc.setFontSize(11);
            doc.text("Gagal memuat gambar lampiran.", 105, 150, { align: "center" });
          }
        } else {
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(15, 23, 42);
          doc.text("LAMPIRAN SURAT KETERANGAN DOKTER", 105, 30, { align: "center" });
          
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          doc.text("Cuti sakit harus disertai dengan surat keterangan dokter jika lebih dari 1 hari.", 105, 45, { align: "center" });
          doc.text("Harap lampirkan atau staples salinan Surat Keterangan Dokter pada area di bawah ini.", 105, 52, { align: "center" });

          // Draw dashed rectangle for attachment area
          doc.setLineWidth(0.5);
          doc.setDrawColor(203, 213, 225);
          doc.setLineDashPattern([5, 5], 0);
          doc.rect(20, 65, 170, 200); 
          doc.setLineDashPattern([], 0); 
          
          doc.setFontSize(14);
          doc.setTextColor(203, 213, 225);
          doc.text("[ AREA LAMPIRAN SURAT DOKTER ]", 105, 165, { align: "center" });
        }
      }

      if (action === 'print') {
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
      } else {
        const fileName = `Cuti_${displayId}_${startDate.toLocaleDateString('id-ID', {month:'long', year:'numeric'})}.pdf`.replace(/\s+/g, '_');
        doc.save(fileName);
      }
    };

    img.onload = () => {
      doc.addImage(img, 'PNG', 14, 12, 20, 20); 
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42); 
      doc.text("RUMAH SAKIT EFARINA ETAHAM KARAWANG", 105, 18, { align: "center" });
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105); 
      doc.text("Jl. Syech Quro No. 1, RT/RW 1/1, Desa Talagamulya, Kec. Telagasari, Karawang, Jawa Barat 41381", 105, 23, { align: "center" });
      doc.text("Telp: 0267 48633003 | Email: rseetahamkarawang@gmail.com", 105, 28, { align: "center" });
      doc.setLineWidth(0.5);
      doc.setDrawColor(203, 213, 225); 
      doc.line(14, 34, 196, 34); 
      drawContent(doc, 45);
    };

    img.onerror = () => {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("RUMAH SAKIT EFARINA ETAHAM KARAWANG", 105, 20, { align: "center" });
      doc.setLineWidth(0.5);
      doc.setDrawColor(203, 213, 225);
      doc.line(14, 26, 196, 26);
      drawContent(doc, 35);
    };
  };

  const handleFetchEmployee = async (id: string) => {
    if (!id) {
      setEmployeeData(null);
      return;
    }
    setIsFetchingEmployee(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:4000/api/employees/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEmployeeData(data);
      } else {
        setEmployeeData(null);
      }
    } catch (err) {
      setEmployeeData(null);
    } finally {
      setIsFetchingEmployee(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idPegawai || !employeeData) {
       alert("ID Pegawai wajib diisi dan data pegawai harus valid/ditemukan.");
       return;
    }
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("access_token");
      const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
      
      // Map jenisCuti to Backend Enum
      const typeMap: Record<string, string> = {
        "Cuti Tahunan": "ANNUAL",
        "Sakit": "SICK",
        "Cuti Melahirkan": "MATERNITY",
        "Izin Penting": "UNPAID"
      };

      let base64String = null;
      if (attachment) {
        base64String = await toBase64(attachment);
      }

      const payload = {
        userId: employeeData?.userId || userInfo.userId || "unknown",
        startDate: new Date(tanggalMulai).toISOString(),
        endDate: new Date(tanggalSelesai).toISOString(),
        type: typeMap[jenisCuti] || "ANNUAL",
        reason: keterangan,
        ...(base64String && { attachmentBase64: base64String })
      };

      const res = await fetch("http://localhost:4000/api/leave-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Gagal mengajukan cuti");

      await fetchLeaveRequests();
      setShowForm(false);
      
      // Reset form
      setIdPegawai("");
      setEmployeeData(null);
      setJenisCuti("Cuti Tahunan");
      setTanggalMulai("");
      setTanggalSelesai("");
      setKeterangan("");
      setAttachment(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalKuota = 12;
  const cutiTerpakai = riwayatCuti
    .filter(c => c.status === "APPROVED" && c.type === "ANNUAL")
    .reduce((total, c) => {
       const start = new Date(c.startDate);
       const end = new Date(c.endDate);
       if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
         const diffTime = Math.abs(end.getTime() - start.getTime());
         return total + Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
       }
       return total;
    }, 0);
  const sisaCuti = Math.max(0, totalKuota - cutiTerpakai);

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Manajemen Cuti</h1>
          <p className="text-slate-400 mt-1">
            {userRole === "EMPLOYEE" 
              ? "Kelola pengajuan cuti dan izin Anda di sini." 
              : "Kelola dan setujui pengajuan cuti seluruh pegawai di sini."}
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Ajukan Cuti Baru
        </button>
      </div>

      {/* Summary Cards */}
      {userRole === "EMPLOYEE" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center gap-4">
            <div className="bg-indigo-500/10 text-indigo-400 p-4 rounded-xl">
              <CalendarDays size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total Kuota Cuti</p>
              <h3 className="text-2xl font-bold text-white">{totalKuota} Hari</h3>
            </div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center gap-4">
            <div className="bg-amber-500/10 text-amber-400 p-4 rounded-xl">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Sisa Cuti</p>
              <h3 className="text-2xl font-bold text-white">{sisaCuti} Hari</h3>
            </div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-xl">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Cuti Terpakai</p>
              <h3 className="text-2xl font-bold text-white">{cutiTerpakai} Hari</h3>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-indigo-400 mb-1">Total Pengajuan</p>
            <h4 className="text-2xl font-bold text-indigo-400">{riwayatCuti.length}</h4>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-amber-400 mb-1">Menunggu</p>
            <h4 className="text-2xl font-bold text-amber-400">{riwayatCuti.filter(c => c.status === "PENDING").length}</h4>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-emerald-400 mb-1">Disetujui</p>
            <h4 className="text-2xl font-bold text-emerald-400">{riwayatCuti.filter(c => c.status === "APPROVED").length}</h4>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-rose-400 mb-1">Ditolak</p>
            <h4 className="text-2xl font-bold text-rose-400">{riwayatCuti.filter(c => c.status === "REJECTED").length}</h4>
          </div>
        </div>
      )}

      {/* Content Tabs */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
        <div className="border-b border-slate-700 px-6 pt-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("riwayat")}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === "riwayat" ? "text-indigo-400" : "text-slate-400 hover:text-white"
              }`}
            >
              Riwayat Cuti
              {activeTab === "riwayat" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("kebijakan")}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === "kebijakan" ? "text-indigo-400" : "text-slate-400 hover:text-white"
              }`}
            >
              Kebijakan Cuti
              {activeTab === "kebijakan" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "riwayat" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/50 text-sm font-medium text-slate-400">
                    <th className="pb-3 font-semibold">Pegawai</th>
                    <th className="pb-3 font-semibold">Jenis Cuti</th>
                    <th className="pb-3 font-semibold">Tanggal</th>
                    <th className="pb-3 font-semibold">Durasi</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-300">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">Memuat data...</td>
                    </tr>
                  ) : errorMsg ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-rose-500">{errorMsg}</td>
                    </tr>
                  ) : riwayatCuti.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">Belum ada riwayat cuti</td>
                    </tr>
                  ) : (
                    riwayatCuti.map((cuti) => {
                      const emp = employees.find(e => e.id === cuti.userId || e.userId === cuti.userId) || {};
                      const displayName = emp.name || cuti.userId;
                      const displayId = emp.id_pegawai || cuti.userId;
                      
                      const startDate = new Date(cuti.startDate);
                      const endDate = new Date(cuti.endDate);
                      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
                      
                      const typeLabel = cuti.type === "ANNUAL" ? "Cuti Tahunan" : cuti.type === "SICK" ? "Sakit" : cuti.type === "MATERNITY" ? "Cuti Melahirkan" : "Izin Penting";
                      const statusLabel = cuti.status === "APPROVED" ? "Disetujui" : cuti.status === "REJECTED" ? "Ditolak" : "Menunggu";

                      return (
                        <tr key={cuti.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                          <td className="py-4 pr-4">
                            <div className="font-bold text-white">{displayName}</div>
                            <div className="text-xs text-slate-400">ID: {displayId}</div>
                          </td>
                          <td className="py-4 font-medium flex items-center gap-3">
                            <div className="p-2 bg-slate-800 rounded-lg text-slate-400 border border-slate-700">
                              <FileText size={16} />
                            </div>
                            {typeLabel}
                          </td>
                          <td className="py-4">
                            {startDate.toLocaleDateString('id-ID', {day:'numeric', month:'short'})} - {endDate.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})}
                          </td>
                          <td className="py-4">{days} Hari</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              cuti.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                              cuti.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {statusLabel}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Cetak Surat */}
                              <button onClick={() => handlePrintSurat(cuti, 'print')} className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Cetak Langsung">
                                 <Printer size={16} />
                              </button>
                              <button onClick={() => handlePrintSurat(cuti, 'download')} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors" title="Download Surat Cuti">
                                 <Download size={16} />
                              </button>

                              {userRole === "ADMIN" && cuti.status === "PENDING" && (
                                <>
                                  <button onClick={() => handleUpdateStatus(cuti.id, 'APPROVED')} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors ml-1">Setujui</button>
                                  <button onClick={() => handleUpdateStatus(cuti.id, 'REJECTED')} className="px-3 py-1 bg-rose-500/10 text-rose-400 text-xs font-semibold rounded-lg border border-rose-500/20 hover:bg-rose-500/20 transition-colors ml-1">Tolak</button>
                                </>
                              )}

                              {/* Hapus */}
                              {(userRole === "ADMIN" || userRole === "SDM" || cuti.status === "PENDING") && (
                                 <button onClick={() => handleDelete(cuti.id)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors ml-1" title="Hapus Pengajuan">
                                   <Trash2 size={16} />
                                 </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "kebijakan" && (
            <div className="prose prose-slate max-w-none prose-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Informasi & Kebijakan Cuti Karyawan</h3>
              <ul className="space-y-2 text-slate-300">
                <li>Hak cuti tahunan karyawan adalah 12 hari per tahun, diberikan setelah masa kerja 1 tahun.</li>
                <li>Pengajuan cuti tahunan maksimal dilakukan 7 hari sebelum tanggal cuti.</li>
                <li>Cuti sakit harus disertai dengan surat keterangan dokter jika lebih dari 1 hari.</li>
                <li>Sisa cuti yang tidak digunakan akan hangus pada akhir periode tahun berjalan.</li>
                <li>Persetujuan cuti bergantung pada beban kerja divisi dan persetujuan atasan langsung.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form Pengajuan Cuti */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-lg font-bold text-white">Form Pengajuan Cuti</h3>
              <button 
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">ID Pegawai (Wajib)</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={idPegawai}
                    onChange={(e) => setIdPegawai(e.target.value)}
                    onBlur={(e) => handleFetchEmployee(e.target.value)}
                    className="w-full border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-800/80 backdrop-blur-sm"
                    placeholder="Contoh: PEG-001"
                    required
                  />
                  {isFetchingEmployee && <div className="absolute right-3 top-3 text-slate-400"><Loader2 size={18} className="animate-spin" /></div>}
                </div>
                {employeeData ? (
                  <div className="text-xs text-emerald-400 font-medium bg-emerald-500/10 p-2 rounded-lg mt-1 border border-emerald-500/20">
                    Ditemukan: <strong>{employeeData.name}</strong> &bull; {employeeData.department?.name || 'Departemen'} &bull; {employeeData.position?.name || 'Jabatan'}
                  </div>
                ) : idPegawai && !isFetchingEmployee ? (
                   <div className="text-xs text-rose-500 font-medium mt-1">Data pegawai tidak ditemukan</div>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Jenis Cuti</label>
                <select 
                  value={jenisCuti}
                  onChange={(e) => setJenisCuti(e.target.value)}
                  className="w-full border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-800/80 backdrop-blur-sm"
                  required
                >
                  <option value="Cuti Tahunan">Cuti Tahunan</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Cuti Melahirkan">Cuti Melahirkan</option>
                  <option value="Izin Penting">Izin Penting / Keperluan Pribadi</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Tanggal Mulai</label>
                  <input 
                    type="date"
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="w-full border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-800/80 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Tanggal Selesai</label>
                  <input 
                    type="date"
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    className="w-full border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-800/80 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {jenisCuti === "Sakit" && tanggalMulai && tanggalSelesai && (
                (() => {
                  const s = new Date(tanggalMulai);
                  const e = new Date(tanggalSelesai);
                  const d = Math.ceil((e.getTime() - s.getTime()) / (1000 * 3600 * 24)) + 1;
                  if (d > 1) {
                    return (
                      <div className="space-y-3">
                        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs p-3 rounded-xl flex gap-2 items-start">
                          <span className="font-bold text-amber-500">Peringatan:</span> 
                          Cuti sakit harus disertai dengan surat keterangan dokter jika lebih dari 1 hari. Lembar lampiran akan tercetak otomatis saat pengajuan disetujui.
                        </div>
                        
                        <div className="space-y-1.5 p-4 border border-dashed border-slate-700 rounded-xl bg-slate-800/50">
                          <label className="text-sm font-medium text-slate-300 block mb-2">Upload Surat Keterangan Dokter (Opsional)</label>
                          <input 
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                            className="block w-full text-sm text-slate-400
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-indigo-500/10 file:text-indigo-400
                              hover:file:bg-indigo-500/20 transition-colors"
                          />
                          {attachment && (
                            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                              File terpilih: {attachment.name}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Keterangan / Alasan</label>
                <textarea 
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-800/80 backdrop-blur-sm resize-none"
                  placeholder="Jelaskan secara singkat alasan pengambilan cuti..."
                  required
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-900/50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70 flex justify-center items-center"
                >
                  {isSubmitting ? "Menyimpan..." : "Kirim Pengajuan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
