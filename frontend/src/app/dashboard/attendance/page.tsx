"use client";

import { useEffect, useState } from "react";
import { Fingerprint, Clock, Calendar, CheckCircle2, XCircle, Loader2, CalendarDays, BarChart3, Users, AlertCircle, Download, Printer } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
  notes: string | null;
  userId: string;
}

interface RekapSummary {
  totalHadir: number;
  totalTelat: number;
  totalAbsen: number;
  totalCuti: number;
}

export default function AttendancePage() {
  const [userRole, setUserRole] = useState("EMPLOYEE");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Data States
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [rekapData, setRekapData] = useState<{ summary?: RekapSummary, data: AttendanceRecord[] }>({ data: [] });
  const [employeeMap, setEmployeeMap] = useState<Record<string, string>>({});
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isClocking, setIsClocking] = useState(false);
  const [hasClockedInToday, setHasClockedInToday] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("log"); // log, harian, mingguan, bulanan
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Timer for live clock
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Load local auth
    const saved = localStorage.getItem("user_info");
    if (saved) {
      try {
        const info = JSON.parse(saved);
        if (info.role) setUserRole(info.role);
      } catch (e) {}
    }

    // Fetch employee mapping
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("http://localhost:4000/api/employees", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const map: Record<string, string> = {};
          data.forEach((emp: any) => {
            // Map both ID pegawai and User ID just in case
            if (emp.id_pegawai) map[emp.id_pegawai] = emp.name;
            if (emp.userId) map[emp.userId] = emp.name;
          });
          setEmployeeMap(map);
        }
      } catch (err) {
        console.error("Gagal memuat data pegawai", err);
      }
    };
    fetchEmployees();

    setMounted(true);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDataForTab(activeTab);
  }, [activeTab]);

  const fetchDataForTab = async (tab: string) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("access_token");
      const headers = { "Authorization": `Bearer ${token}` };
      
      let url = "http://localhost:4000/api/attendance"; // default: all (live log)
      
      if (tab === "harian") url = "http://localhost:4000/api/attendance/rekap/harian";
      else if (tab === "mingguan") url = "http://localhost:4000/api/attendance/rekap/mingguan";
      else if (tab === "bulanan") url = "http://localhost:4000/api/attendance/rekap/bulanan";

      const res = await fetch(url, { headers });
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_info");
          window.location.href = "/login";
          return;
        }
        let errorText = "Gagal mengambil data presensi dari server.";
        try {
          const errData = await res.json();
          errorText = errData.message || `Server Error ${res.status}`;
        } catch(e) {
          errorText = `Server Error ${res.status}`;
        }
        throw new Error(errorText);
      }
      
      const data = await res.json();

      if (tab === "log") {
        setRecords(Array.isArray(data) ? data : []);
        // Cek apakah user sudah absen hari ini
        const today = new Date().toISOString().split('T')[0];
        const clockedIn = (Array.isArray(data) ? data : []).some(r => r.date.startsWith(today) && r.userId === JSON.parse(localStorage.getItem("user_info") || "{}").userId);
        setHasClockedInToday(clockedIn);
      } else {
        setRekapData(data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan jaringan.");
      console.error(err);
      
      // Fallback DUMMY DATA jika server belum siap sepenuhnya
      if (tab === "log") {
        setRecords([
          { id: "1", date: new Date().toISOString(), checkIn: new Date(new Date().setHours(7, 45, 0, 0)).toISOString(), checkOut: null, status: "PRESENT", notes: "Hadir", userId: "USER-123" }
        ]);
      } else {
        setRekapData({
          summary: { totalHadir: 45, totalTelat: 3, totalAbsen: 0, totalCuti: 2 },
          data: []
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockInOut = async () => {
    setIsClocking(true);
    setTimeout(() => {
      setHasClockedInToday(!hasClockedInToday);
      setIsClocking(false);
    }, 1500);
  };

  const handleExportPDF = (action: 'download' | 'print' = 'download') => {
    const doc = new jsPDF();
    
    // Attempt to load logo. If successful, draw it. If not, just draw text.
    const logoUrl = "/logo.png";
    const img = new window.Image();
    img.src = logoUrl;
    
    img.onload = () => {
      // Draw kop surat with logo
      doc.addImage(img, 'PNG', 14, 12, 20, 20); // x, y, width, height
      
      // Hospital Name
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("RUMAH SAKIT EFARINA ETAHAM KARAWANG", 105, 18, { align: "center" });
      
      // Address
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text("Jl. Syech Quro No. 1, RT/RW 1/1, Desa Talagamulya, Kec. Telagasari, Karawang, Jawa Barat 41381", 105, 23, { align: "center" });
      doc.text("Telp: 0267 48633003 | Email: rseetahamkarawang@gmail.com", 105, 28, { align: "center" });
      
      // Horizontal Line
      doc.setLineWidth(0.5);
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.line(14, 34, 196, 34); // x1, y1, x2, y2

      drawContent(doc, 45);
    };

    img.onerror = () => {
      // Fallback if logo fails to load
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("RUMAH SAKIT EFARINA ETAHAM KARAWANG", 105, 20, { align: "center" });
      
      doc.setLineWidth(0.5);
      doc.setDrawColor(203, 213, 225);
      doc.line(14, 26, 196, 26);

      drawContent(doc, 35);
    };

    const drawContent = (doc: jsPDF, startY: number) => {
      // Title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("LAPORAN PRESENSI PEGAWAI", 105, startY, { align: "center" });
      
      // Date and Period
      const periodeMap: Record<string, string> = { harian: "Harian", mingguan: "Mingguan", bulanan: "Bulanan" };
      const dateNow = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      
      startY += 10;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      const labelX = 14;
      const colonX = 45;
      const valueX = 48;

      doc.text("Periode Laporan", labelX, startY);
      doc.text(":", colonX, startY);
      doc.setFont("helvetica", "bold");
      doc.text(periodeMap[activeTab] || 'Live Log', valueX, startY);
      
      startY += 6;
      doc.setFont("helvetica", "normal");
      doc.text("Tanggal Cetak", labelX, startY);
      doc.text(":", colonX, startY);
      doc.text(dateNow, valueX, startY);

      // Summary
      if (activeTab !== "log" && rekapData.summary) {
        startY += 8;
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(`*Ringkasan: Hadir (${rekapData.summary.totalHadir}) | Terlambat (${rekapData.summary.totalTelat}) | Cuti (${rekapData.summary.totalCuti}) | Alpha (${rekapData.summary.totalAbsen})`, 14, startY);
      }

      startY += 8;

      // Table
      const dataToExport = activeTab === "log" ? records : rekapData.data;
      const tableData = dataToExport.map((rec: any) => {
        const date = new Date(rec.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        const checkIn = new Date(rec.checkIn).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
        const checkOut = rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '-';
        let status = rec.status === "PRESENT" ? "Hadir" : rec.status === "LATE" ? "Terlambat" : rec.status;
        const empName = employeeMap[rec.userId] || "Unknown";

        return userRole !== "EMPLOYEE" 
          ? [rec.userId || '-', empName, date, checkIn, checkOut, status]
          : [date, checkIn, checkOut, status];
      });

      const head = userRole !== "EMPLOYEE" 
        ? [['ID Pegawai', 'Nama Pegawai', 'Tanggal', 'Jam Masuk', 'Jam Keluar', 'Status']]
        : [['Tanggal', 'Jam Masuk', 'Jam Keluar', 'Status']];

      autoTable(doc, {
        startY,
        head: head,
        body: tableData,
        theme: 'grid',
        headStyles: { 
          fillColor: [30, 41, 59], // slate-800
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          textColor: [51, 65, 85], // slate-700
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // slate-50
        },
      });

      // Signature 
      const finalY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Karawang, " + dateNow, 160, finalY, { align: "center" });
      doc.text("Mengetahui,", 160, finalY + 5, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.text("HRD RS Efarina Etaham Karawang", 160, finalY + 25, { align: "center" });

      if (action === 'print') {
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
      } else {
        doc.save(`Laporan_Presensi_${periodeMap[activeTab] || 'Log'}_${new Date().getTime()}.pdf`);
      }
    };
  };

  const timeString = mounted ? currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "--:--:--";
  const dateString = mounted ? currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Memuat tanggal...";

  const renderSummaryCards = (summary?: RekapSummary) => {
    if (!summary) return null;
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
          <p className="text-sm font-medium text-emerald-400 mb-1">Total Hadir</p>
          <h4 className="text-2xl font-bold text-emerald-400">{summary.totalHadir}</h4>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
          <p className="text-sm font-medium text-amber-400 mb-1">Total Terlambat</p>
          <h4 className="text-2xl font-bold text-amber-400">{summary.totalTelat}</h4>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
          <p className="text-sm font-medium text-indigo-400 mb-1">Total Cuti/Izin</p>
          <h4 className="text-2xl font-bold text-indigo-400">{summary.totalCuti}</h4>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
          <p className="text-sm font-medium text-rose-400 mb-1">Total Alpha</p>
          <h4 className="text-2xl font-bold text-rose-400">{summary.totalAbsen}</h4>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Profile & Role */}
      <div className="bg-slate-800/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Sistem Presensi</h1>
          <p className="text-slate-400 mt-1">
            {userRole === "EMPLOYEE" ? "Rekam kehadiran Anda dan lihat riwayat." : "Monitor kehadiran & rekap data sinkronisasi mesin Fingerspot."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: CLOCK MACHINE */}
        {(userRole === "EMPLOYEE" || userRole === "ADMIN") && (
          <div className="xl:col-span-1 bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden group">
            <div className="relative z-10 w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 mb-6">
                <Calendar size={14} className="text-indigo-400" />
                <span className="text-sm font-medium text-slate-300">{dateString}</span>
              </div>

              <div className="text-5xl font-bold text-white tracking-wider font-mono mb-8">
                {timeString.replace(/\./g, ':')}
              </div>

              <button
                onClick={handleClockInOut}
                disabled={isClocking}
                className={`relative w-48 h-48 mx-auto rounded-full flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
                  isClocking ? 'bg-slate-100 border-4 border-slate-700 scale-95' 
                  : hasClockedInToday 
                    ? 'bg-gradient-to-br from-rose-500 hover:from-rose-600 to-red-600 hover:to-red-700 border-4 border-rose-500/20'
                    : 'bg-gradient-to-br from-emerald-400 hover:from-emerald-500 to-teal-500 hover:to-teal-600 border-4 border-emerald-500/20'
                }`}
              >
                {!isClocking && (
                   <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${hasClockedInToday ? 'bg-rose-500/100' : 'bg-emerald-400'}`} />
                )}

                {isClocking ? (
                  <Loader2 size={48} className="text-slate-400 animate-spin opacity-80" />
                ) : (
                  <Fingerprint size={56} className="text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
                )}
                
                <span className={`text-lg font-bold tracking-widest uppercase ${isClocking ? 'text-slate-400' : 'text-white'}`}>
                  {isClocking ? "Processing" : hasClockedInToday ? "Clock Out" : "Clock In"}
                </span>
              </button>

              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400">
                <Clock size={16} />
                <span>Shift Normal: 08:00 - 17:00 WIB</span>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: ATTENDANCE LOG & REKAP (TABS) */}
        <div className={`bg-slate-800/80 backdrop-blur-sm border border-slate-700 shadow-sm rounded-2xl flex flex-col overflow-hidden ${userRole === "HRD" ? "xl:col-span-3" : "xl:col-span-2"}`}>
          
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-700 bg-slate-900/50/50 px-4 pt-4">
            <button onClick={() => setActiveTab("log")} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === "log" ? "border-indigo-600 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"}`}>
              <Clock size={16} /> Live Log
            </button>
            <button onClick={() => setActiveTab("harian")} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === "harian" ? "border-indigo-600 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"}`}>
              <BarChart3 size={16} /> Rekap Harian
            </button>
            <button onClick={() => setActiveTab("mingguan")} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === "mingguan" ? "border-indigo-600 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"}`}>
              <CalendarDays size={16} /> Rekap Mingguan
            </button>
            <button onClick={() => setActiveTab("bulanan")} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === "bulanan" ? "border-indigo-600 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"}`}>
              <Calendar size={16} /> Rekap Bulanan
            </button>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle size={18} />
                {errorMsg}
              </div>
            )}

            {activeTab !== "log" && renderSummaryCards(rekapData.summary)}

            {userRole !== "EMPLOYEE" && (() => {
              const dataToProcess = activeTab === "log" ? records : rekapData.data;
              const lateRecords = dataToProcess.filter(r => r.status === "LATE");
              if (lateRecords.length === 0) return null;
              
              return (
                <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                    <AlertCircle size={16} /> Daftar Pegawai Terlambat ({lateRecords.length} orang)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {lateRecords.map((rec, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-300">
                        <Users size={12} className="text-slate-500" />
                        {employeeMap[rec.userId] || rec.userId || 'Unknown'}
                        <span className="text-amber-500 font-mono ml-1">{new Date(rec.checkIn).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Export Header */}
            {activeTab !== "log" && (
              <div className="flex justify-between items-center mb-4 mt-2">
                <h3 className="text-white font-bold text-lg">Detail Laporan {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleExportPDF('print')}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
                  >
                    <Printer size={16} />
                    Cetak Langsung
                  </button>
                  <button 
                    onClick={() => handleExportPDF('download')}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
                  >
                    <Download size={16} />
                    Export to PDF
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto border border-slate-700/50 rounded-xl flex-1">
              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center text-indigo-400 gap-3">
                  <Loader2 className="animate-spin" size={32} />
                  <p className="text-sm text-slate-400">Memuat data...</p>
                </div>
              ) : (activeTab === "log" ? records : rekapData.data).length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                  Tidak ada data presensi untuk periode ini.
                </div>
              ) : (
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs uppercase bg-slate-900/50 text-slate-400 border-b border-slate-700">
                    <tr>
                      {userRole !== "EMPLOYEE" && (
                        <>
                          <th className="px-6 py-4 font-medium">Pegawai ID</th>
                          <th className="px-6 py-4 font-medium">Nama Pegawai</th>
                        </>
                      )}
                      <th className="px-6 py-4 font-medium">Tanggal</th>
                      <th className="px-6 py-4 font-medium">Masuk</th>
                      <th className="px-6 py-4 font-medium">Keluar</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {(activeTab === "log" ? records : rekapData.data).map((rec, i) => (
                      <tr key={i} className="hover:bg-slate-900/50/80 transition-colors">
                        {userRole !== "EMPLOYEE" && (
                          <>
                            <td className="px-6 py-4 font-mono text-xs text-slate-400">{rec.userId || '-'}</td>
                            <td className="px-6 py-4 font-medium text-slate-300">{employeeMap[rec.userId] || 'Unknown'}</td>
                          </>
                        )}
                        <td className="px-6 py-4 font-medium text-slate-300">
                          {new Date(rec.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 font-medium text-emerald-400">
                          {new Date(rec.checkIn).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="px-6 py-4 font-medium text-rose-500">
                          {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            rec.status === "PRESENT" ? 'bg-emerald-100 text-emerald-400' :
                            rec.status === "LATE" ? 'bg-amber-100 text-amber-400' :
                            'bg-indigo-100 text-indigo-400'
                          }`}>
                            {rec.status === "PRESENT" ? <CheckCircle2 size={12} /> :
                             rec.status === "LATE" ? <Clock size={12} /> : <XCircle size={12} />}
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
