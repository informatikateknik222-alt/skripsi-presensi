"use client";

import { 
  Users, UserCheck, CalendarDays, TrendingUp, 
  Clock, ArrowRightLeft, FileText, Wallet,
  Calendar, CheckCircle2, XCircle, AlertCircle,
  Loader2, DollarSign
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [userRole, setUserRole] = useState("EMPLOYEE");
  const [userName, setUserName] = useState("Pegawai");
  const [userId, setUserId] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Admin Data States
  const [adminData, setAdminData] = useState({
    totalPegawai: 0,
    hadirHariIni: 0,
    sedangCuti: 0,
    terlambat: 0
  });

  // Keuangan Data States
  const [keuanganData, setKeuanganData] = useState({
    totalPaid: 0,
    paidCount: 0,
    activeCycle: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
    pendingCount: 0
  });

  // Employee Data States
  const [employeeData, setEmployeeData] = useState({
    kehadiranBulanIni: "0%",
    keterlambatan: 0,
    sisaCuti: 12,
    gajiBulanIni: "Tersedia"
  });

  // Common Data States
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("user_info");
    let uRole = "EMPLOYEE";
    let uId = "";
    if (saved) {
      try {
        const info = JSON.parse(saved);
        if (info.role) {
          uRole = info.role;
          setUserRole(info.role);
        }
        if (info.username) setUserName(info.username);
        if (info.userId) {
          uId = info.userId;
          setUserId(info.userId);
        }
      } catch (e) {}
    }

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    
    // Set initial time
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));

    fetchDashboardData(uRole, uId);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (role: string, currentUserId: string) => {
    setIsLoading(true);
    const token = localStorage.getItem("access_token");
    const headers = { "Authorization": `Bearer ${token}` };

    try {
      if (role === "KEUANGAN") {
        const [payrollRes, attLogsRes] = await Promise.all([
          fetch("http://localhost:4000/api/payroll-records", { headers }).catch(() => null),
          fetch("http://localhost:4000/api/attendance", { headers }).catch(() => null)
        ]);

        let totalPaid = 0;
        let paidCount = 0;
        let pendingCount = 0;

        if (payrollRes && payrollRes.ok) {
          const data = await payrollRes.json();
          if (Array.isArray(data)) {
            data.forEach((r: any) => {
              if (r.status === "PAID") {
                totalPaid += parseFloat(r.netSalary || 0);
                paidCount += 1;
              } else {
                pendingCount += 1;
              }
            });
          }
        }

        if (attLogsRes && attLogsRes.ok) {
          const logsData = await attLogsRes.json();
          if (Array.isArray(logsData)) {
            const sorted = [...logsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setRecentActivities(sorted.slice(0, 5));
          }
        }

        setKeuanganData({
          totalPaid,
          paidCount,
          activeCycle: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
          pendingCount
        });

      } else if (role === "ADMIN" || role === "SDM") {
        // Fetch Admin Data
        const [empRes, attHarianRes, attLogsRes] = await Promise.all([
          fetch("http://localhost:4000/api/employees", { headers }).catch(() => null),
          fetch("http://localhost:4000/api/attendance/rekap/harian", { headers }).catch(() => null),
          fetch("http://localhost:4000/api/attendance", { headers }).catch(() => null)
        ]);

        let totalPegawai = 0;
        if (empRes && empRes.ok) {
          const empData = await empRes.json();
          totalPegawai = Array.isArray(empData) ? empData.length : 0;
        }

        let hadirHariIni = 0;
        let terlambat = 0;
        let sedangCuti = 0;
        if (attHarianRes && attHarianRes.ok) {
          const harianData = await attHarianRes.json();
          if (harianData?.summary) {
            hadirHariIni = harianData.summary.totalHadir || 0;
            terlambat = harianData.summary.totalTelat || 0;
            sedangCuti = harianData.summary.totalCuti || 0;
          }
        }

        if (attLogsRes && attLogsRes.ok) {
          const logsData = await attLogsRes.json();
          if (Array.isArray(logsData)) {
            // Sort by date descending for recent activities
            const sorted = [...logsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setRecentActivities(sorted.slice(0, 5));
          }
        }

        setAdminData({
          totalPegawai,
          hadirHariIni,
          sedangCuti,
          terlambat
        });

      } else {
        // Fetch Employee Data
        const [attBulananRes, attLogsRes, leaveRes] = await Promise.all([
          fetch("http://localhost:4000/api/attendance/rekap/bulanan", { headers }).catch(() => null),
          fetch("http://localhost:4000/api/attendance", { headers }).catch(() => null),
          fetch("http://localhost:4000/api/leave-requests", { headers }).catch(() => null)
        ]);

        let kehadiranBulanIni = "0%";
        let keterlambatan = 0;
        if (attBulananRes && attBulananRes.ok) {
          const bulananData = await attBulananRes.json();
          if (bulananData?.summary) {
             const hadir = bulananData.summary.totalHadir || 0;
             keterlambatan = bulananData.summary.totalTelat || 0;
             const totalWorkDays = 22; // Assumed average working days
             kehadiranBulanIni = Math.min(Math.round((hadir / totalWorkDays) * 100), 100) + "%";
          }
        }

        if (attLogsRes && attLogsRes.ok) {
          const logsData = await attLogsRes.json();
          if (Array.isArray(logsData)) {
            // Filter user logs
            const userLogs = logsData.filter((log: any) => log.userId === currentUserId || (log.user && log.user.id === currentUserId));
            const sorted = [...userLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setRecentLogs(sorted.slice(0, 3));
            setRecentActivities(sorted.slice(0, 5));
          }
        }

        let sisaCuti = 12;
        if (leaveRes && leaveRes.ok) {
          const leaveData = await leaveRes.json();
          if (Array.isArray(leaveData)) {
             const userLeaves = leaveData.filter((l: any) => 
               (l.userId === currentUserId || (l.user && l.user.id === currentUserId)) &&
               l.status === "APPROVED"
             );
             
             // count days
             let usedDays = 0;
             userLeaves.forEach(l => {
                const start = new Date(l.startDate);
                const end = new Date(l.endDate);
                if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                  const diffTime = Math.abs(end.getTime() - start.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                  usedDays += diffDays;
                }
             });
             sisaCuti = Math.max(0, 12 - usedDays);
          }
        }

        setEmployeeData({
          kehadiranBulanIni,
          keterlambatan,
          sisaCuti,
          gajiBulanIni: "Tersedia"
        });
      }
    } catch (e) {
      console.error("Failed to fetch dashboard data", e);
    } finally {
      setIsLoading(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount).replace(/\u00A0/g, ' ');
  };

  const keuanganStats = [
    { title: "Total Gaji Dibayar", value: formatCurrency(keuanganData.totalPaid), icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "Pegawai Dibayar", value: keuanganData.paidCount.toString(), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Siklus Aktif", value: keuanganData.activeCycle, icon: TrendingUp, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { title: "Status Pending", value: keuanganData.pendingCount.toString(), icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  const adminStats = [
    { title: "Total Pegawai", value: adminData.totalPegawai.toString(), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Hadir Hari Ini", value: adminData.hadirHariIni.toString(), icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "Sedang Cuti", value: adminData.sedangCuti.toString(), icon: CalendarDays, color: "text-amber-400", bg: "bg-amber-500/10" },
    { title: "Terlambat", value: adminData.terlambat.toString(), icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-500/10" },
  ];

  const employeeStats = [
    { title: "Kehadiran Bulan Ini", value: employeeData.kehadiranBulanIni, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "Keterlambatan", value: employeeData.keterlambatan.toString(), icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-500/10" },
    { title: "Sisa Cuti", value: `${employeeData.sisaCuti} Hari`, icon: CalendarDays, color: "text-amber-400", bg: "bg-amber-500/10" },
    { title: "Gaji Bulan Ini", value: employeeData.gajiBulanIni, icon: Wallet, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  ];

  const renderStats = (userRole === "ADMIN" || userRole === "SDM") ? adminStats : userRole === "KEUANGAN" ? keuanganStats : employeeStats;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-slate-800/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Selamat Datang, {userName}!</h1>
          <p className="text-slate-400 mt-1">
            {userRole === "EMPLOYEE" 
              ? "Semoga hari Anda menyenangkan. Jangan lupa untuk melakukan presensi." 
              : userRole === "KEUANGAN"
              ? "Ringkasan data keuangan dan penggajian hari ini."
              : "Ringkasan data SDM hari ini."}
          </p>
        </div>
        <div className="text-right flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
          <div className="bg-indigo-500/20 p-3 rounded-full text-indigo-400">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{currentTime || "00:00"}</div>
            <div className="text-sm text-slate-400 font-medium">{currentDate}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions (Employee) */}
      {userRole === "EMPLOYEE" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/attendance" className="bg-indigo-600 p-6 rounded-2xl shadow-sm text-white flex justify-between items-center hover:bg-indigo-700 transition-colors cursor-pointer group">
            <div>
              <p className="text-indigo-100 font-medium mb-1">Presensi Masuk</p>
              <h3 className="text-xl font-bold">Catat Kehadiran</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform">
              <ArrowRightLeft size={24} />
            </div>
          </Link>
          <Link href="/dashboard/leave" className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-sm hover:border-indigo-500/50 transition-colors cursor-pointer flex items-center gap-4">
            <div className="bg-amber-500/10 text-amber-400 p-3 rounded-xl">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white">Ajukan Cuti</h3>
              <p className="text-sm text-slate-400">Permohonan izin/cuti</p>
            </div>
          </Link>
          <Link href="/dashboard/payroll" className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-sm hover:border-indigo-500/50 transition-colors cursor-pointer flex items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white">Slip Gaji</h3>
              <p className="text-sm text-slate-400">Lihat riwayat penggajian</p>
            </div>
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-8 gap-3 text-indigo-400 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700">
           <Loader2 className="animate-spin" size={24} />
           <span className="font-medium">Memuat data dashboard...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderStats.map((stat, i) => (
            <div key={i} className="bg-slate-800/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-700 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                <h3 className="text-xl font-bold text-white mt-0.5">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel */}
        <div className="lg:col-span-2 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">
              {userRole === "EMPLOYEE" ? "Riwayat Presensi Terbaru" : "Grafik Kehadiran Mingguan"}
            </h3>
            {userRole === "EMPLOYEE" && (
              <Link href="/dashboard/attendance" className="text-sm text-indigo-400 font-medium hover:underline">
                Lihat Semua
              </Link>
            )}
          </div>
          
          {isLoading ? (
             <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-slate-500" size={32} />
             </div>
          ) : userRole === "EMPLOYEE" ? (
            <div className="space-y-4">
              {recentLogs.length > 0 ? recentLogs.map((log, i) => {
                const isLate = log.status === "LATE";
                return (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-700/50 bg-slate-900/50">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-slate-400">
                        <CalendarDays size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {new Date(log.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-sm text-slate-400">
                          Masuk: {new Date(log.checkIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} &bull; 
                          Pulang: {log.checkOut ? new Date(log.checkOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isLate ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {log.status === "PRESENT" ? "Hadir" : log.status === "LATE" ? "Terlambat" : log.status}
                    </span>
                  </div>
                )
              }) : (
                <div className="text-center py-8 text-slate-400 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                  Belum ada riwayat presensi.
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/30 min-h-[250px] relative p-6 overflow-hidden">
               {/* Simple mock chart visualization for HRD */}
               <div className="w-full h-full flex items-end justify-between gap-2">
                 {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <div key={i} className="w-full flex flex-col justify-end items-center group relative">
                       <div 
                         className="w-full bg-indigo-500/30 rounded-t-md hover:bg-indigo-400/50 transition-colors" 
                         style={{ height: `${h}%` }}
                       ></div>
                       <span className="text-xs text-slate-500 mt-2 font-medium opacity-50 group-hover:opacity-100">H-{6-i}</span>
                    </div>
                 ))}
               </div>
               <div className="absolute top-4 left-4 flex items-center gap-2">
                 <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-3 h-3 rounded bg-indigo-500/30"></div> Total Kehadiran (7 Hari)</span>
               </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Aktivitas Terkini</h3>
          </div>
          
          {isLoading ? (
             <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-slate-500" size={24} />
             </div>
          ) : (
            <div className="space-y-6">
              {recentActivities.length > 0 ? (
                <div className="relative pl-6 border-l-2 border-slate-700 space-y-6">
                  {recentActivities.map((act, i) => {
                    const isCheckIn = !act.checkOut;
                    const actionText = isCheckIn ? "Check-in" : "Check-out";
                    const colorClass = isCheckIn ? "bg-emerald-500" : "bg-rose-500";
                    const timeString = new Date(isCheckIn ? act.checkIn : act.checkOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    const displayName = act.user?.name || act.userId || "Pegawai";

                    return (
                      <div key={i} className="relative">
                        <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full ${colorClass} ring-4 ring-[#0f172a]`}></span>
                        <p className="text-sm font-semibold text-white">{displayName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{actionText} pada {timeString} WIB</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Belum ada aktivitas terekam.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
