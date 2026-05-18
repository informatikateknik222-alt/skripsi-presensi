"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar, Loader2, CalendarDays, BarChart3, Users, AlertCircle, Download, Printer } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAttendance } from "@/modules/attendance/hooks/useAttendance";
import { AttendanceClock } from "@/modules/attendance/components/AttendanceClock";
import { AttendanceStats } from "@/modules/attendance/components/AttendanceStats";
import { AttendanceTable } from "@/modules/attendance/components/AttendanceTable";

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("log");
  const {
    records,
    rekapData,
    employeeMap,
    isLoading,
    errorMsg,
    hasClockedInToday,
    setHasClockedInToday,
    refresh
  } = useAttendance(activeTab);

  const [userRole, setUserRole] = useState("EMPLOYEE");
  const [isClocking, setIsClocking] = useState(false);
  const [selectedShift, setSelectedShift] = useState("general");

  useEffect(() => {
    const saved = localStorage.getItem("user_info");
    if (saved) {
      try {
        const info = JSON.parse(saved);
        if (info.role) setUserRole(info.role);
      } catch (e) {}
    }
  }, []);

  const handleClockInOut = async (shift: string) => {
    setIsClocking(true);
    // In a real app, we would call the API here with the shift
    // await attendanceService.clockInOut({ shift });
    
    setTimeout(() => {
      setHasClockedInToday(!hasClockedInToday);
      setIsClocking(false);
      refresh();
    }, 1500);
  };

  const handleExportPDF = (action: 'download' | 'print' = 'download') => {
    const doc = new jsPDF();
    const logoUrl = "/logo.png";
    const img = new window.Image();
    img.src = logoUrl;
    
    img.onload = () => {
      drawContent(doc, 45);
    };

    img.onerror = () => {
      drawContent(doc, 45);
    };

    const drawContent = (doc: jsPDF, startY: number) => {
      // Header Background (Professional Dark Slate)
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, 210, 35, 'F');
      
      // Draw Logo
      try {
        doc.addImage(img, 'PNG', 14, 8, 18, 18);
      } catch (e) {
        console.error("Gagal menambahkan logo ke PDF", e);
      }
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("RS EFARINA ETAHAM KARAWANG", 105, 18, { align: "center" });
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Jl. Syech Quro No. 1, Kec. Telagasari, Karawang, Jawa Barat 41381", 105, 24, { align: "center" });
      doc.text("Email: hrd@efarina-karawang.co.id | Telp: (0267) 123456", 105, 28, { align: "center" });

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("LAPORAN PRESENSI PEGAWAI", 105, 48, { align: "center" });
      
      const periodeMap: Record<string, string> = { harian: "Harian", mingguan: "Mingguan", bulanan: "Bulanan" };
      const dateNow = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      
      startY = 58;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      doc.text("Periode Laporan", 14, startY);
      doc.text(`: ${periodeMap[activeTab] || 'Live Log'}`, 45, startY);
      
      doc.text("Tanggal Cetak", 14, startY + 6);
      doc.text(`: ${dateNow}`, 45, startY + 6);

      if (activeTab !== "log" && rekapData.summary) {
        startY += 12;
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(14, startY - 4, 182, 10, 2, 2, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(`RINGKASAN:   HADIR: ${rekapData.summary.totalHadir}   |   TERLAMBAT: ${rekapData.summary.totalTelat}   |   CUTI: ${rekapData.summary.totalCuti}`, 105, startY + 2, { align: "center" });
      }

      startY += 12;
      const dataToExport = activeTab === "log" ? records : rekapData.data;
      const tableData = dataToExport.map((rec: any) => {
        const date = new Date(rec.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        const checkIn = new Date(rec.checkIn).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
        const checkOut = rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '-';
        const empName = employeeMap[rec.userId] || "Unknown";
        const shift = rec.shift || "-";
        return [empName, date, checkIn, checkOut, shift, rec.status];
      });

      autoTable(doc, {
        startY: startY + 5,
        head: [['Nama Pegawai', 'Tanggal', 'Masuk', 'Keluar', 'Shift', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [248, 250, 252] }
      });

      const finalY = (doc as any).lastAutoTable.finalY + 25;
      const signatureY = finalY > 250 ? 40 : finalY;
      if (finalY > 250) doc.addPage();
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Karawang, " + dateNow, 160, signatureY, { align: "center" });
      doc.text("Mengetahui,", 160, signatureY + 6, { align: "center" });
      doc.text("Kepala HRD,", 160, signatureY + 12, { align: "center" });
      
      doc.setFont("helvetica", "bold");
      doc.text("( ________________________ )", 160, signatureY + 35, { align: "center" });
      doc.text("RS Efarina Etaham Karawang", 160, signatureY + 40, { align: "center" });

      if (action === 'print') {
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
      } else {
        doc.save(`Laporan_Presensi_${activeTab}.pdf`);
      }
    };
  };

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Monitoring Presensi</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Pantau status kedatangan karyawan dan rekap data Fingerspot secara real-time.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Cari nama karyawan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl flex flex-col overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-4 pt-4">
            {["log", "harian", "mingguan", "bulanan"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300"}`}
              >
                {tab === "log" ? <Clock size={16} /> : tab === "harian" ? <BarChart3 size={16} /> : tab === "mingguan" ? <CalendarDays size={16} /> : <Calendar size={16} />}
                {tab === "log" ? "Live Log" : `Rekap ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
              </button>
            ))}
          </div>

          <div className="p-6 flex-1 flex flex-col">
            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle size={18} />
                {errorMsg}
              </div>
            )}

            {activeTab !== "log" && <AttendanceStats summary={rekapData.summary} />}

            <div className="flex justify-between items-center mb-4 mt-2">
              <h3 className="text-slate-900 dark:text-white font-bold text-lg">
                {activeTab === "log" ? "Log Kedatangan Hari Ini" : `Detail Laporan ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
              </h3>
              <div className="flex gap-2">
                {activeTab !== "log" && (
                  <>
                    <button onClick={() => handleExportPDF('print')} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
                      <Printer size={16} /> Cetak
                    </button>
                    <button onClick={() => handleExportPDF('download')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
                      <Download size={16} /> PDF
                    </button>
                  </>
                )}
              </div>
            </div>

            <AttendanceTable 
              records={(activeTab === "log" ? records : rekapData.data).filter(r => {
                const name = (employeeMap[r.userId] || "").toLowerCase();
                return name.includes(searchQuery.toLowerCase());
              })}
              employeeMap={employeeMap}
              isLoading={isLoading}
              userRole={userRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
