"use client";

import { DollarSign, Users, TrendingUp, FileText, CreditCard, Loader2, Plus, Edit2, Trash2, X, Search, Printer, Download } from "lucide-react";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PayrollPage() {
  const [userRole, setUserRole] = useState("EMPLOYEE");
  const [records, setRecords] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("");

  const [stats, setStats] = useState({
    totalPaid: 0,
    paidCount: 0,
    activeCycle: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
    pendingCount: 0
  });

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [idPegawai, setIdPegawai] = useState("");
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [isFetchingEmployee, setIsFetchingEmployee] = useState(false);

  const [formData, setFormData] = useState({
    period: new Date().toISOString().slice(0, 7), // YYYY-MM
    basicSalary: 0,
    totalAllowance: 0,
    totalDeduction: 0,
    bpjsDeduction: 0,
    taxDeduction: 0,
    status: "DRAFT"
  });

  useEffect(() => {
    const saved = localStorage.getItem("user_info");
    if (saved) {
      try {
        const info = JSON.parse(saved);
        if (info.role) setUserRole(info.role);
      } catch (e) {}
    }
    fetchEmployees();
    fetchPayrollRecords();
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

  const fetchPayrollRecords = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:4000/api/payroll-records", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_info");
          window.location.href = "/login";
          return;
        }
        throw new Error("Gagal mengambil data penggajian.");
      }
      
      const data = await res.json();
      setRecords(data);
      
      let totalPaid = 0;
      let paidCount = 0;
      let pendingCount = 0;
      
      data.forEach((r: any) => {
        if (r.status === "PAID") {
          totalPaid += parseFloat(r.netSalary);
          paidCount += 1;
        } else {
          pendingCount += 1;
        }
      });
      
      setStats(prev => ({
        ...prev,
        totalPaid,
        paidCount,
        pendingCount
      }));

    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
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

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingId("");
    setIdPegawai("");
    setEmployeeData(null);
    setFormData({
      period: new Date().toISOString().slice(0, 7),
      basicSalary: 0,
      totalAllowance: 0,
      totalDeduction: 0,
      bpjsDeduction: 0,
      taxDeduction: 0,
      status: "DRAFT"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record: any) => {
    setIsEditMode(true);
    setEditingId(record.id);
    setIdPegawai(record.userId);
    setEmployeeData({ name: "Data Tersimpan", userId: record.userId }); // Mock data
    
    // Convert date to YYYY-MM
    const dateObj = new Date(record.period);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    
    setFormData({
      period: `${year}-${month}`,
      basicSalary: parseFloat(record.basicSalary) || 0,
      totalAllowance: parseFloat(record.totalAllowance) || 0,
      totalDeduction: parseFloat(record.totalDeduction) || 0,
      bpjsDeduction: parseFloat(record.bpjsDeduction) || 0,
      taxDeduction: parseFloat(record.taxDeduction) || 0,
      status: record.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeData && !isEditMode) {
      alert("Pegawai tidak ditemukan. Pastikan ID Pegawai valid.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      const url = isEditMode 
        ? `http://localhost:4000/api/payroll-records/${editingId}`
        : "http://localhost:4000/api/payroll-records";
        
      const method = isEditMode ? "PATCH" : "POST";

      const netSalary = Number(formData.basicSalary) + Number(formData.totalAllowance) - Number(formData.totalDeduction) - Number(formData.bpjsDeduction) - Number(formData.taxDeduction);

      const payload = {
        userId: isEditMode ? idPegawai : employeeData.userId,
        period: new Date(formData.period + "-01").toISOString(), // First day of the selected month
        basicSalary: Number(formData.basicSalary),
        totalAllowance: Number(formData.totalAllowance),
        totalDeduction: Number(formData.totalDeduction),
        bpjsDeduction: Number(formData.bpjsDeduction),
        taxDeduction: Number(formData.taxDeduction),
        netSalary: netSalary,
        status: formData.status
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menyimpan data penggajian");
      }

      await fetchPayrollRecords();
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus catatan penggajian ini?")) return;
    
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:4000/api/payroll-records/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Gagal menghapus data penggajian");

      await fetchPayrollRecords();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount).replace(/\u00A0/g, ' ');
  };

  const calculateNetSalary = () => {
    return Number(formData.basicSalary) + Number(formData.totalAllowance) - Number(formData.totalDeduction) - Number(formData.bpjsDeduction) - Number(formData.taxDeduction);
  };

  const handleAutoGenerate = async () => {
    if (!window.confirm("Proses ini akan mengambil data presensi bulan ini dan membuat draf slip gaji untuk semua pegawai. Lanjutkan?")) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };
      
      const [empRes, attRes] = await Promise.all([
        fetch("http://localhost:4000/api/employees", { headers }),
        fetch("http://localhost:4000/api/attendance", { headers })
      ]);
      
      const empData = await empRes.json();
      const attData = await attRes.json();
      
      const currMonth = new Date().getMonth();
      const currYear = new Date().getFullYear();
      const periodStr = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-01T00:00:00.000Z`;

      const thisMonthAtt = Array.isArray(attData) ? attData.filter(a => {
        const d = new Date(a.date);
        return d.getMonth() === currMonth && d.getFullYear() === currYear;
      }) : [];

      for (const emp of empData) {
        // Skip admins if they don't get regular payroll, or keep them
        const userAtt = thisMonthAtt.filter(a => a.userId === emp.id || a.user?.id === emp.id);
        const totalHadir = userAtt.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
        const totalTelat = userAtt.filter(a => a.status === 'LATE').length;

        const basicSalary = 4000000;
        const totalAllowance = totalHadir * 50000;
        const potonganTelat = totalTelat * 25000;
        const bpjsDeduction = basicSalary * 0.03;
        const taxDeduction = basicSalary * 0.05;
        const totalDeduction = potonganTelat;
        const netSalary = basicSalary + totalAllowance - totalDeduction - bpjsDeduction - taxDeduction;

        const payload = {
          userId: emp.userId || emp.id,
          period: periodStr,
          basicSalary,
          totalAllowance,
          totalDeduction,
          bpjsDeduction,
          taxDeduction,
          netSalary,
          status: "DRAFT"
        };

        // Fire and forget or await, better await to avoid overwhelming server
        await fetch("http://localhost:4000/api/payroll-records", {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });
      }
      
      alert("Proses Auto-Generate berhasil!");
      await fetchPayrollRecords();
    } catch (e: any) {
      alert("Gagal melakukan Auto-Generate: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintSlip = (record: any, action: 'download' | 'print' = 'print') => {
    const emp = employees.find(e => e.id === record.userId || e.userId === record.userId) || {};
    const displayId = emp.id_pegawai || record.userId;
    const displayName = emp.name || record.userId;
    const deptName = emp.department?.name || "-";
    const posName = emp.position?.name || "-";

    const doc = new jsPDF();
    const logoUrl = "/logo.png";
    const img = new window.Image();
    img.src = logoUrl;
    
    const dateObj = new Date(record.period);
    const periodStr = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const dateNow = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    const drawContent = (doc: jsPDF, startY: number) => {
      // Title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("SLIP GAJI PEGAWAI", 105, startY, { align: "center" });
      
      startY += 10;
      
      // Employee Info
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      const startX = 14;
      const colonX = 40;
      const valueX = 43;

      doc.text("ID Pegawai", startX, startY);
      doc.text(":", colonX, startY);
      doc.text(displayId, valueX, startY);

      doc.text("Nama", startX, startY + 6);
      doc.text(":", colonX, startY + 6);
      doc.text(displayName, valueX, startY + 6);

      doc.text("Departemen", startX, startY + 12);
      doc.text(":", colonX, startY + 12);
      doc.text(`${deptName} / ${posName}`, valueX, startY + 12);

      doc.text("Periode", startX, startY + 18);
      doc.text(":", colonX, startY + 18);
      doc.text(periodStr, valueX, startY + 18);
      
      startY += 26;

      // Table Data
      const tableData = [
        ['Gaji Pokok', formatCurrency(parseFloat(record.basicSalary || 0))],
        ['Tunjangan', formatCurrency(parseFloat(record.totalAllowance || 0))],
        ['Potongan Keterlambatan/Lainnya', formatCurrency(parseFloat(record.totalDeduction || 0))],
        ['Potongan BPJS (3%)', formatCurrency(parseFloat(record.bpjsDeduction || 0))],
        ['Potongan PPh 21 (5%)', formatCurrency(parseFloat(record.taxDeduction || 0))],
      ];

      autoTable(doc, {
        startY,
        head: [['Keterangan', 'Jumlah']],
        body: tableData,
        theme: 'grid',
        headStyles: { 
          fillColor: [30, 41, 59], // slate-800
          textColor: 255,
          fontStyle: 'bold'
        },
        bodyStyles: {
          textColor: [51, 65, 85], // slate-700
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // slate-50
        },
        foot: [['PENERIMAAN BERSIH', formatCurrency(parseFloat(record.netSalary || 0))]],
        footStyles: {
          fillColor: [226, 232, 240], // slate-200
          textColor: [15, 23, 42],
          fontStyle: 'bold'
        }
      });

      // Signature 
      const finalY = (doc as any).lastAutoTable.finalY + 30;
      
      // Pegawai Signature (Left)
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Penerima,", 50, finalY, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.text(`(${displayName})`, 50, finalY + 25, { align: "center" });

      // Keuangan Signature (Right)
      doc.setFont("helvetica", "normal");
      doc.text("Karawang, " + dateNow, 160, finalY - 5, { align: "center" });
      doc.text("Dibuat Oleh,", 160, finalY, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.text("Keuangan RS Efarina Etaham", 160, finalY + 25, { align: "center" });

      if (action === 'print') {
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
      } else {
        const fileName = `Slip_Gaji_${displayId}_${periodStr.replace(/\s+/g, '_')}.pdf`;
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

  const filteredRecords = records.filter(r => {
    const emp = employees.find(e => e.id === r.userId || e.userId === r.userId) || {};
    const searchTarget = `${r.userId} ${emp.name || ""} ${emp.id_pegawai || ""}`.toLowerCase();
    const matchName = searchTarget.includes(searchTerm.toLowerCase());
    const matchPeriod = filterPeriod ? r.period.startsWith(filterPeriod) : true;
    return matchName && matchPeriod;
  });

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Dashboard Penggajian</h1>
          <p className="text-slate-400 mt-1">Ringkasan dan riwayat pembayaran gaji pegawai.</p>
        </div>
        
        {(userRole === "ADMIN" || userRole === "KEUANGAN") && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleAutoGenerate}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <FileText size={18} />
              Auto-Generate (Bulan Ini)
            </button>
            <button 
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <Plus size={18} />
              Buat Manual
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-sm hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
            <DollarSign size={24} />
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Total Gaji Dibayar</p>
          <h3 className="text-2xl font-bold text-white">{formatCurrency(stats.totalPaid)}</h3>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-sm hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Pegawai Dibayar</p>
          <h3 className="text-2xl font-bold text-white">{stats.paidCount}</h3>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-sm hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Siklus Aktif</p>
          <h3 className="text-xl font-bold text-white">{stats.activeCycle}</h3>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-sm hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center mb-4">
            <FileText size={24} />
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Status Pending</p>
          <h3 className="text-2xl font-bold text-white">{stats.pendingCount}</h3>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CreditCard className="text-slate-400" size={24} />
            <h2 className="text-xl font-bold text-white">Riwayat Payroll</h2>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari ID Pegawai..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
             </div>
             <input 
                type="month"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-48 appearance-none"
             />
          </div>
        </div>
        
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 flex flex-col justify-center items-center gap-3 text-indigo-400">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-slate-400 text-sm">Memuat data...</p>
            </div>
          ) : errorMsg ? (
            <div className="p-8 text-center text-rose-400 text-sm">{errorMsg}</div>
          ) : records.length === 0 ? (
             <div className="p-8 text-center text-slate-400 text-sm">Belum ada data penggajian.</div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {filteredRecords.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">Tidak ditemukan data yang cocok dengan filter.</div>
              ) : filteredRecords.map((r, i) => {
                const emp = employees.find(e => e.id === r.userId || e.userId === r.userId) || {};
                const displayId = emp.id_pegawai || r.userId;
                const displayName = emp.name || r.userId;
                
                return (
                <div key={r.id || i} className="flex flex-col sm:flex-row justify-between sm:items-center p-6 hover:bg-slate-900/50 transition-colors gap-4">
                  <div>
                    <div className="font-mono text-sm text-slate-400 mb-1">#{r.id?.substring(0,8).toUpperCase() || 'PR00X'}</div>
                    <div className="text-white font-bold">{displayName}</div>
                    <div className="text-xs text-slate-400 mt-1">ID: {displayId} | Periode: {new Date(r.period).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="text-xl font-bold text-white">{formatCurrency(parseFloat(r.netSalary))}</div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        r.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' : 
                        r.status === 'PROCESSED' ? 'bg-indigo-500/10 text-indigo-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {r.status === 'PAID' ? 'Lunas' : r.status === 'PROCESSED' ? 'Diproses' : 'Draft'}
                      </span>
                      
                      <div className="flex items-center gap-1 ml-2 border-l border-slate-700 pl-3">
                        {/* Cetak Slip Button for everyone */}
                        <button 
                          onClick={() => handlePrintSlip(r, 'print')}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          title="Cetak Langsung"
                        >
                          <Printer size={16} />
                        </button>
                        <button 
                          onClick={() => handlePrintSlip(r, 'download')}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                          title="Download Slip Gaji"
                        >
                          <Download size={16} />
                        </button>

                        {(userRole === "ADMIN" || userRole === "KEUANGAN") && (
                          <>
                            <button 
                              onClick={() => openEditModal(r)}
                              className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(r.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 sticky top-0">
              <h3 className="text-lg font-bold text-white">
                {isEditMode ? 'Edit Slip Gaji' : 'Buat Slip Gaji Baru'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="payrollForm" onSubmit={handleSubmit} className="space-y-4">
                
                {/* Pencarian Pegawai */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">ID Pegawai</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={idPegawai}
                      onChange={(e) => setIdPegawai(e.target.value)}
                      onBlur={(e) => handleFetchEmployee(e.target.value)}
                      disabled={isEditMode}
                      className="w-full border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-900/50 disabled:opacity-50"
                      placeholder="Contoh: PEG-001"
                      required
                    />
                    {isFetchingEmployee && <div className="absolute right-3 top-3 text-slate-400"><Loader2 size={18} className="animate-spin" /></div>}
                  </div>
                  {employeeData && !isEditMode ? (
                    <div className="text-xs text-emerald-400 font-medium bg-emerald-500/10 p-2 rounded-lg mt-1 border border-emerald-500/20">
                      Ditemukan: <strong>{employeeData.name || employeeData.userId}</strong>
                    </div>
                  ) : idPegawai && !isFetchingEmployee && !isEditMode ? (
                     <div className="text-xs text-rose-400 font-medium mt-1">Tekan luar kolom untuk mencari pegawai.</div>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Periode (Bulan/Tahun)</label>
                  <input 
                    type="month"
                    value={formData.period}
                    onChange={(e) => setFormData({...formData, period: e.target.value})}
                    className="w-full border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-900/50"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Status Pembayaran</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-900/50 appearance-none"
                    required
                  >
                    <option value="DRAFT" className="bg-slate-800 text-white">Draft</option>
                    <option value="PROCESSED" className="bg-slate-800 text-white">Diproses</option>
                    <option value="PAID" className="bg-slate-800 text-white">Lunas (Paid)</option>
                  </select>
                </div>

                <div className="my-4 border-t border-slate-700"></div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Gaji Pokok (Rp)</label>
                  <input 
                    type="number"
                    min="0"
                    value={formData.basicSalary}
                    onChange={(e) => setFormData({...formData, basicSalary: Number(e.target.value)})}
                    className="w-full border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-900/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tunjangan (Rp)</label>
                    <input 
                      type="number"
                      min="0"
                      value={formData.totalAllowance}
                      onChange={(e) => setFormData({...formData, totalAllowance: Number(e.target.value)})}
                      className="w-full border border-slate-700 rounded-xl px-4 py-2.5 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-900/50 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Pot. Lain/Terlambat (Rp)</label>
                    <input 
                      type="number"
                      min="0"
                      value={formData.totalDeduction}
                      onChange={(e) => setFormData({...formData, totalDeduction: Number(e.target.value)})}
                      className="w-full border border-slate-700 rounded-xl px-4 py-2.5 text-rose-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-900/50 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Pot. BPJS (Rp)</label>
                    <input 
                      type="number"
                      min="0"
                      value={formData.bpjsDeduction}
                      onChange={(e) => setFormData({...formData, bpjsDeduction: Number(e.target.value)})}
                      className="w-full border border-slate-700 rounded-xl px-4 py-2.5 text-rose-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-900/50 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Pot. Pajak PPh 21 (Rp)</label>
                    <input 
                      type="number"
                      min="0"
                      value={formData.taxDeduction}
                      onChange={(e) => setFormData({...formData, taxDeduction: Number(e.target.value)})}
                      className="w-full border border-slate-700 rounded-xl px-4 py-2.5 text-rose-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-900/50 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex justify-between items-center">
                  <span className="font-semibold text-indigo-100">Gaji Bersih (Net)</span>
                  <span className="text-xl font-bold text-indigo-400">
                    {formatCurrency(calculateNetSalary())}
                  </span>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-slate-700 bg-slate-900/50 flex gap-3 sticky bottom-0">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                form="payrollForm"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
