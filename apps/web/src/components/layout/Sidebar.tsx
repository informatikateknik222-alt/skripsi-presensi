import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/context/LanguageContext";
import { 
  X, LayoutDashboard, Users, Clock, 
  CreditCard, FileText, Settings, LogOut 
} from "lucide-react";

// Icon mapping dictionary for dynamic menu rendering
const iconMap: Record<string, any> = {
  LayoutDashboard,
  Users,
  Clock,
  CreditCard,
  FileText,
  Settings
};

// Default navigation structure
const defaultNavigation = [
  { id: "dashboard", name: "dashboard", href: "/dashboard", iconName: "LayoutDashboard", roles: ["ADMIN", "SDM", "KEUANGAN", "EMPLOYEE"], isActive: true },
  { id: "employees", name: "pegawai", href: "/dashboard/employees", iconName: "Users", roles: ["ADMIN", "SDM"], isActive: true },
  { id: "attendance", name: "presensi", href: "/dashboard/attendance", iconName: "Clock", roles: ["ADMIN", "SDM", "EMPLOYEE"], isActive: true },
  { id: "payroll", name: "penggajian", href: "/dashboard/payroll", iconName: "CreditCard", roles: ["ADMIN", "KEUANGAN", "EMPLOYEE"], isActive: true },
  { id: "leave", name: "cuti", href: "/dashboard/leave", iconName: "FileText", roles: ["ADMIN", "SDM", "EMPLOYEE"], isActive: true },
];

// Default modules structure
const defaultModules = [
  { id: "employees", name: "Manajemen Pegawai", isActive: true, description: "Pengelolaan data karyawan, departemen, dan jabatan." },
  { id: "attendance", name: "Presensi & Fingerspot", isActive: true, description: "Pencatatan absensi harian dan integrasi mesin Fingerspot." },
  { id: "payroll", name: "Sistem Penggajian", isActive: true, description: "Kalkulasi gaji bulanan, BPJS, insentif, dan slip gaji." },
  { id: "leave", name: "Manajemen Cuti", isActive: true, description: "Pengajuan, verifikasi, dan kuota cuti tahunan." }
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState("EMPLOYEE");
  const [navigation, setNavigation] = useState(defaultNavigation);
  const [activeModules, setActiveModules] = useState<Record<string, boolean>>({
    employees: true,
    attendance: true,
    payroll: true,
    leave: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("user_info");
    if (saved) {
      try {
        const info = JSON.parse(saved);
        if (info.role) setUserRole(info.role);
      } catch (e) {}
    }

    const loadSettings = () => {
      // Load modules
      const savedModules = localStorage.getItem("module_settings");
      let loadedModules: Record<string, boolean> = {
        employees: true,
        attendance: true,
        payroll: true,
        leave: true,
      };
      if (savedModules) {
        try {
          const parsed = JSON.parse(savedModules);
          parsed.forEach((mod: any) => {
            loadedModules[mod.id] = mod.isActive;
          });
        } catch (e) {}
      } else {
        localStorage.setItem("module_settings", JSON.stringify(defaultModules));
      }
      setActiveModules(loadedModules);

      // Load navigation
      const savedNav = localStorage.getItem("navigation_settings");
      if (savedNav) {
        try {
          setNavigation(JSON.parse(savedNav));
        } catch (e) {}
      } else {
        localStorage.setItem("navigation_settings", JSON.stringify(defaultNavigation));
      }
    };

    loadSettings();

    // Listen for custom settings change events to dynamically refresh sidebar
    if (typeof window !== "undefined") {
      window.addEventListener("system-settings-changed", loadSettings);
      return () => {
        window.removeEventListener("system-settings-changed", loadSettings);
      };
    }
  }, []);

  const handleLogout = () => {
    // Hapus dari daftar sesi aktif
    try {
      const saved = localStorage.getItem("user_info");
      if (saved) {
        const info = JSON.parse(saved);
        if (info.username) {
          const accountId = info.username.toLowerCase();
          const activeSessions = JSON.parse(localStorage.getItem("active_sessions") || "{}");
          delete activeSessions[accountId];
          localStorage.setItem("active_sessions", JSON.stringify(activeSessions));
        }
      }
    } catch (e) {}

    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.replace("/");
  };

  // Filter allowed navigation items by user role, menu visibility, and active modules
  const allowedNav = navigation.filter(item => {
    // 1. Roles filter
    if (!item.roles.includes(userRole)) return false;
    // 2. Menu visibility check
    if (!item.isActive) return false;
    // 3. Module active check (dashboard is core, always active)
    if (item.id !== "dashboard" && activeModules[item.id] === false) return false;
    return true;
  });


  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <div className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-[70] flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="RS Efarina Logo" className="w-8 h-8 rounded-lg shadow-sm" />
            <div className="flex flex-col justify-center">
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">RS <span className="text-indigo-600 dark:text-indigo-400">Efarina</span></span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">Karawang</span>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Menu Utama</p>
          {allowedNav.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = iconMap[item.iconName] || FileText;
            return (
              <Link
                key={item.id || item.name}
                href={item.href}
                onClick={() => { if (window.innerWidth < 768) onClose?.(); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                     ? "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10"
                     : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-sm"></div>
                )}
                <IconComponent
                  size={18}
                  className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-slate-300 transition-colors"}
                />
                {t(item.name)}
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          {userRole === "ADMIN" && (
            <Link 
              href="/dashboard/settings" 
              onClick={() => { if (window.innerWidth < 768) onClose?.(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${pathname === '/dashboard/settings' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Settings size={18} className={pathname === '/dashboard/settings' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-slate-300'} />
              {t("pengaturan")}
            </Link>
          )}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all">
            <LogOut size={18} className="text-rose-500" />
            {t("keluar")}
          </button>
        </div>
      </div>
    </>
  );
}
