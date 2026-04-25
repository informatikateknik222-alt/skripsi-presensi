"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarCheck, Wallet, Settings, LogOut, Clock, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

const allNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "SDM", "KEUANGAN"] },
  { name: "Pegawai", href: "/dashboard/employees", icon: Users, roles: ["ADMIN", "SDM"] },
  { name: "Presensi", href: "/dashboard/attendance", icon: Clock, roles: ["ADMIN", "SDM", "KEUANGAN"] },
  { name: "Cuti", href: "/dashboard/leave", icon: CalendarDays, roles: ["ADMIN", "SDM"] },
  { name: "Penggajian", href: "/dashboard/payroll", icon: Wallet, roles: ["ADMIN", "KEUANGAN"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState("EMPLOYEE");

  useEffect(() => {
    const saved = localStorage.getItem("user_info");
    if (saved) {
      try {
        const info = JSON.parse(saved);
        if (info.role) setUserRole(info.role);
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    window.location.href = "/login";
  };

  const allowedNav = allNavigation.filter(nav => nav.roles.includes(userRole));

  return (
    <div className="hidden md:flex w-64 flex-col bg-slate-900 border-r border-slate-800 h-screen sticky top-0 transition-all duration-300 z-50">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="RS Efarina Logo" className="w-8 h-8 rounded-lg shadow-sm" />
          <span className="text-lg font-bold text-white tracking-tight">RS <span className="text-indigo-400">Efarina</span></span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu Utama</p>
        {allowedNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "text-indigo-400 bg-indigo-500/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-sm"></div>
              )}
              <item.icon
                size={18}
                className={isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300 transition-colors"}
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800 space-y-1">
        {userRole === "ADMIN" && (
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <Settings size={18} className="text-slate-500" />
            Pengaturan Sistem
          </Link>
        )}
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all">
          <LogOut size={18} className="text-rose-500" />
          Keluar
        </button>
      </div>
    </div>
  );
}
