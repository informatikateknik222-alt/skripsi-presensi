"use client";

import { 
  Users, UserCheck, CalendarDays, TrendingUp, 
  Clock, ArrowRightLeft, FileText, Wallet,
  Calendar, CheckCircle2, XCircle, AlertCircle,
  Loader2, DollarSign
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton, CardSkeleton, TableRowSkeleton } from "@/components/ui/Skeleton";

import { useTranslation } from "@/context/LanguageContext";
import { useDashboard } from "@/modules/dashboard/hooks/useDashboard";

export default function DashboardPage() {
  const { t, language } = useTranslation();
  const [userRole, setUserRole] = useState("EMPLOYEE");
  const [userName, setUserName] = useState("Pegawai");
  const [userId, setUserId] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("user_info");
    if (saved) {
      try {
        const info = JSON.parse(saved);
        if (info.role) setUserRole(info.role);
        if (info.username) setUserName(info.username);
        if (info.userId) setUserId(info.userId);
      } catch (e) {}
    }

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' }));

    return () => clearInterval(interval);
  }, [language]);

  const {
    isLoading,
    adminData,
    keuanganData,
    recentActivities,
    weeklyAttendance,
    refresh
  } = useDashboard(userRole, userId);

  // Employee Data (Separate hook or simplified for now)
  const [employeeData, setEmployeeData] = useState({
    kehadiranBulanIni: "0%",
    keterlambatan: 0,
    sisaCuti: 12,
    gajiBulanIni: "Tersedia"
  });

  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  const currentDate = new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount).replace(/\u00A0/g, ' ');
  };

  const keuanganStats = [
    { title: t("total_gaji"), value: formatCurrency(keuanganData.totalPaid), icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: t("pegawai_dibayar"), value: keuanganData.paidCount.toString(), icon: UserCheck, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: t("total_pegawai"), value: adminData.totalPegawai.toString(), icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { title: t("status_pending"), value: keuanganData.pendingCount.toString(), icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  const adminStats = [
    { title: t("total_pegawai"), value: adminData.totalPegawai.toString(), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
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
    <div className="space-y-6 transition-colors duration-300">
      {/* Header section */}
      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t("selamat_datang")}, {userName}!</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {userRole === "EMPLOYEE" 
              ? "Semoga hari Anda menyenangkan. Jangan lupa untuk melakukan presensi." 
              : t("ringkasan_data")}
          </p>
        </div>
        <div className="text-right flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="bg-indigo-500/20 p-3 rounded-full text-indigo-600 dark:text-indigo-400">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{currentTime || "00:00"}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{currentDate}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
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
          <Link href="/dashboard/leave" className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-500/50 transition-colors cursor-pointer flex items-center gap-4">
            <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 p-3 rounded-xl">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Ajukan Cuti</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Permohonan izin/cuti</p>
            </div>
          </Link>
          <Link href="/dashboard/payroll" className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-500/50 transition-colors cursor-pointer flex items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Slip Gaji</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Lihat riwayat penggajian</p>
            </div>
          </Link>
        </div>
      )}

      {(userRole === "ADMIN" || userRole === "SDM") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/employees" className="bg-indigo-600 p-6 rounded-2xl shadow-sm text-white flex justify-between items-center hover:bg-indigo-700 transition-colors cursor-pointer group">
            <div>
              <p className="text-indigo-100 font-medium mb-1">Manajemen SDM</p>
              <h3 className="text-xl font-bold">Kelola Data Pegawai</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
          </Link>
          <Link href="/dashboard/attendance" className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-500/50 transition-colors cursor-pointer flex items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Monitoring Presensi</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pantau kehadiran harian</p>
            </div>
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderStats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {userRole === "EMPLOYEE" ? "Riwayat Presensi Terbaru" : "Grafik Kehadiran Mingguan"}
            </h3>
            {userRole === "EMPLOYEE" && (
              <Link href="/dashboard/attendance" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                Lihat Semua
              </Link>
            )}
          </div>
          
          {isLoading ? (
             <div className="space-y-4">
                {[1, 2, 3].map(i => <TableRowSkeleton key={i} />)}
             </div>
          ) : userRole === "EMPLOYEE" ? (
            <div className="space-y-4">
              {recentLogs.length > 0 ? recentLogs.map((log, i) => {
                const isLate = log.status === "LATE";
                return (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-4">
                      <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400">
                        <CalendarDays size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {new Date(log.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Masuk: {new Date(log.checkIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} &bull; 
                          Pulang: {log.checkOut ? new Date(log.checkOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isLate ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                      {log.status === "PRESENT" ? "Hadir" : log.status === "LATE" ? "Terlambat" : log.status}
                    </span>
                  </div>
                )
              }) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  Belum ada riwayat presensi.
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/30 min-h-[250px] relative p-6 overflow-hidden">
               {/* Simple mock chart visualization for HRD */}
               <div className="w-full h-full flex items-end justify-between gap-2">
                 {(weeklyAttendance.length > 0 ? weeklyAttendance.map((d: any) => d.status === 'PRESENT' ? 80 : 0).slice(0,7) : [0, 0, 0, 0, 0, 0, 0]).map((h, i) => (
                    <div key={i} className="w-full flex flex-col justify-end items-center group relative">
                       <div 
                         className="w-full bg-indigo-500/30 rounded-t-md hover:bg-indigo-400/50 transition-colors" 
                         style={{ height: `${h || 10}%` }}
                       ></div>
                       <span className="text-xs text-slate-500 mt-2 font-medium opacity-50 group-hover:opacity-100">H-{6-i}</span>
                    </div>
                 ))}
               </div>
               <div className="absolute top-4 left-4 flex items-center gap-2">
                 <span className="flex items-center gap-1 text-xs text-slate-500"><div className="w-3 h-3 rounded bg-indigo-500/30"></div> Total Kehadiran Mingguan: {weeklyAttendance.filter(a => a.status === 'PRESENT').length} Orang</span>
               </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aktivitas Terkini</h3>
          </div>
          
          {isLoading ? (
             <div className="space-y-6 pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="relative space-y-2">
                    <Skeleton className="absolute -left-[31px] top-1 w-4 h-4 rounded-full" />
                    <Skeleton className="h-4 w-1/2" variant="text" />
                    <Skeleton className="h-3 w-1/4" variant="text" />
                  </div>
                ))}
             </div>
          ) : (
            <div className="space-y-6">
              {recentActivities.length > 0 ? (
                <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 space-y-6">
                  {recentActivities.map((act, i) => {
                    const isCheckIn = !act.checkOut;
                    const actionText = isCheckIn ? "Check-in" : "Check-out";
                    const colorClass = isCheckIn ? "bg-emerald-500" : "bg-rose-500";
                    const timeString = new Date(isCheckIn ? act.checkIn : act.checkOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    const displayName = act.user?.name || act.userId || "Pegawai";

                    return (
                      <div key={i} className="relative">
                        <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full ${colorClass} ring-4 ring-white dark:ring-[#0f172a]`}></span>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{displayName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{actionText} pada {timeString} WIB</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
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
