"use client";

import { 
  Bell, Lock, Moon, Globe, Shield, Smartphone, Loader2,
  Sliders, Cpu, Menu, Hash, ArrowUp, ArrowDown, Eye, EyeOff, Check 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { NumberingService } from "@/lib/numberingService";

export default function SettingsPage() {
  const { language: currentLang, setLanguage: changeLang, t } = useTranslation();
  const [activeTab, setActiveTab] = useState("security");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Notifications State
  const [notifSystem, setNotifSystem] = useState(true);
  const [notifLeave, setNotifLeave] = useState(true);
  const [notifPayroll, setNotifPayroll] = useState(false);

  // Theme State
  const [theme, setTheme] = useState("dark");

  // System Management States
  const [userRole, setUserRole] = useState("EMPLOYEE");
  const [activeSystemSubTab, setActiveSystemSubTab] = useState("modules");
  const [systemModules, setSystemModules] = useState<any[]>([]);
  const [systemMenus, setSystemMenus] = useState<any[]>([]);
  const [systemNumbering, setSystemNumbering] = useState({
    employee: { prefix: "RS", delimiter: "-", digits: 4 },
    payroll: { prefix: "PAY", delimiter: "-", digits: 4 },
    leave: { prefix: "LV", delimiter: "-", digits: 3 }
  });

  // Load saved preferences on mount
  useEffect(() => {
    // Load notifications settings
    const savedNotifs = localStorage.getItem("notif_settings");
    if (savedNotifs) {
      try {
        const parsed = JSON.parse(savedNotifs);
        if (typeof parsed.system === "boolean") setNotifSystem(parsed.system);
        if (typeof parsed.leave === "boolean") setNotifLeave(parsed.leave);
        if (typeof parsed.payroll === "boolean") setNotifPayroll(parsed.payroll);
      } catch (e) {}
    }

    // Load theme setting
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);

    // Load user role
    const savedUserInfo = localStorage.getItem("user_info");
    if (savedUserInfo) {
      try {
        const info = JSON.parse(savedUserInfo);
        if (info.role) setUserRole(info.role);
      } catch (e) {}
    }

    // Load system module settings
    const savedModules = localStorage.getItem("module_settings");
    if (savedModules) {
      try {
        setSystemModules(JSON.parse(savedModules));
      } catch (e) {}
    } else {
      const defaultModules = [
        { id: "employees", name: "Manajemen Pegawai", isActive: true, description: "Pengelolaan data karyawan, departemen, dan jabatan." },
        { id: "attendance", name: "Presensi & Fingerspot", isActive: true, description: "Pencatatan absensi harian dan integrasi mesin Fingerspot." },
        { id: "payroll", name: "Sistem Penggajian", isActive: true, description: "Kalkulasi gaji bulanan, BPJS, insentif, dan slip gaji." },
        { id: "leave", name: "Manajemen Cuti", isActive: true, description: "Pengajuan, verifikasi, dan kuota cuti tahunan." }
      ];
      setSystemModules(defaultModules);
      localStorage.setItem("module_settings", JSON.stringify(defaultModules));
    }

    // Load system menu settings
    const savedNav = localStorage.getItem("navigation_settings");
    if (savedNav) {
      try {
        setSystemMenus(JSON.parse(savedNav));
      } catch (e) {}
    } else {
      const defaultNavigation = [
        { id: "dashboard", name: "dashboard", href: "/dashboard", iconName: "LayoutDashboard", roles: ["ADMIN", "SDM", "KEUANGAN", "EMPLOYEE"], isActive: true },
        { id: "employees", name: "pegawai", href: "/dashboard/employees", iconName: "Users", roles: ["ADMIN", "SDM"], isActive: true },
        { id: "attendance", name: "presensi", href: "/dashboard/attendance", iconName: "Clock", roles: ["ADMIN", "SDM", "EMPLOYEE"], isActive: true },
        { id: "payroll", name: "penggajian", href: "/dashboard/payroll", iconName: "CreditCard", roles: ["ADMIN", "KEUANGAN", "EMPLOYEE"], isActive: true },
        { id: "leave", name: "cuti", href: "/dashboard/leave", iconName: "FileText", roles: ["ADMIN", "SDM", "EMPLOYEE"], isActive: true },
      ];
      setSystemMenus(defaultNavigation);
      localStorage.setItem("navigation_settings", JSON.stringify(defaultNavigation));
    }

    // Load system numbering settings
    const savedNumbering = NumberingService.getSettings();
    setSystemNumbering(savedNumbering);
  }, []);

  const saveNotificationSettings = () => {
    localStorage.setItem("notif_settings", JSON.stringify({
      system: notifSystem,
      leave: notifLeave,
      payroll: notifPayroll
    }));
    setMessage({ type: "success", text: "Pengaturan notifikasi berhasil disimpan!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleChangeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add('dark');
      setMessage({ type: "success", text: "Tema Gelap (Dark Mode) berhasil diaktifkan." });
    } else {
      document.documentElement.classList.remove('dark');
      setMessage({ type: "success", text: "Tema Terang (Light Mode) berhasil diaktifkan." });
    }
    
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleChangeLanguage = (lang: string) => {
    changeLang(lang);
    setMessage({ type: "success", text: t("bahasa_success") });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleChangePassword = async () => {
    setMessage({ type: "", text: "" });
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Semua kolom wajib diisi" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi kata sandi tidak cocok" });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: "success", text: "Kata sandi berhasil diperbarui secara lokal!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: "error", text: "Terjadi kesalahan sistem." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // System Management Handler Functions
  const handleToggleModule = (id: string) => {
    const updated = systemModules.map(mod => 
      mod.id === id ? { ...mod, isActive: !mod.isActive } : mod
    );
    setSystemModules(updated);
    localStorage.setItem("module_settings", JSON.stringify(updated));
    window.dispatchEvent(new Event("system-settings-changed"));
    
    setMessage({ 
      type: "success", 
      text: `Modul "${updated.find(m => m.id === id)?.name}" berhasil ${updated.find(m => m.id === id)?.isActive ? 'diaktifkan' : 'dinonaktifkan'}!` 
    });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleToggleMenu = (id: string) => {
    const updated = systemMenus.map(menu => 
      menu.id === id ? { ...menu, isActive: !menu.isActive } : menu
    );
    setSystemMenus(updated);
    localStorage.setItem("navigation_settings", JSON.stringify(updated));
    window.dispatchEvent(new Event("system-settings-changed"));
    
    setMessage({ 
      type: "success", 
      text: `Visibilitas menu "${updated.find(m => m.id === id)?.name}" berhasil diperbarui!` 
    });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleMoveMenu = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === systemMenus.length - 1) return;
    
    const updated = [...systemMenus];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    setSystemMenus(updated);
    localStorage.setItem("navigation_settings", JSON.stringify(updated));
    window.dispatchEvent(new Event("system-settings-changed"));
    
    setMessage({ type: "success", text: "Urutan menu sidebar berhasil disesuaikan!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleToggleMenuRole = (menuId: string, role: string) => {
    const updated = systemMenus.map(menu => {
      if (menu.id === menuId) {
        const roles = [...menu.roles];
        if (roles.includes(role)) {
          if (menuId === "dashboard" && role === "ADMIN") return menu; // Protect Admin access to dashboard
          return { ...menu, roles: roles.filter(r => r !== role) };
        } else {
          return { ...menu, roles: [...roles, role] };
        }
      }
      return menu;
    });
    setSystemMenus(updated);
    localStorage.setItem("navigation_settings", JSON.stringify(updated));
    window.dispatchEvent(new Event("system-settings-changed"));
    
    setMessage({ type: "success", text: "Hak akses peran menu berhasil diperbarui!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleSaveNumberingSettings = (key: 'employee' | 'payroll' | 'leave', field: string, value: any) => {
    const updated = {
      ...systemNumbering,
      [key]: {
        ...systemNumbering[key],
        [field]: value
      }
    };
    setSystemNumbering(updated);
    NumberingService.saveSettings(updated);
    window.dispatchEvent(new Event("system-settings-changed"));
  };


  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t("pengaturan")}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Kelola preferensi dan pengaturan sistem keamanan akun Anda.</p>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Settings Menu */}
        <div className="col-span-1 space-y-2">
          <button 
            onClick={() => { setActiveTab("security"); setMessage({ type: "", text: "" }); }}
            className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${activeTab === 'security' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Lock size={18} />
            {t("keamanan_akun")}
          </button>
          <button 
            onClick={() => { setActiveTab("notifications"); setMessage({ type: "", text: "" }); }}
            className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${activeTab === 'notifications' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Bell size={18} />
            {t("notifikasi")}
          </button>
          <button 
            onClick={() => { setActiveTab("theme"); setMessage({ type: "", text: "" }); }}
            className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${activeTab === 'theme' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Moon size={18} />
            {t("tampilan_tema")}
          </button>
          <button 
            onClick={() => { setActiveTab("language"); setMessage({ type: "", text: "" }); }}
            className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${activeTab === 'language' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Globe size={18} />
            {t("bahasa")}
          </button>
          {userRole === "ADMIN" && (
            <button 
              onClick={() => { setActiveTab("system"); setMessage({ type: "", text: "" }); }}
              className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${activeTab === 'system' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Sliders size={18} />
              Manajemen Sistem
            </button>
          )}
        </div>

        {/* Setting Content */}
        <div className="col-span-2 space-y-6">
          
          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Security Box */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl shadow-black/5 dark:shadow-black/10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield size={20} className="text-indigo-500 dark:text-indigo-400" />
                    Ubah Kata Sandi
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pastikan akun Anda menggunakan kata sandi yang kuat.</p>
                </div>

                <div className="space-y-4 relative">
                  {message.text && (
                    <div className={`p-3 rounded-xl text-sm font-medium border ${
                      message.type === 'error' 
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    }`}>
                      {message.text}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kata Sandi Saat Ini</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kata Sandi Baru</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Konfirmasi Kata Sandi Baru</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all" 
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end relative">
                  <button 
                    onClick={handleChangePassword}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </div>

              {/* 2FA Box */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl shadow-black/5 dark:shadow-black/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Smartphone size={20} className="text-emerald-500 dark:text-emerald-400" />
                      Autentikasi Dua Langkah (2FA)
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tambahkan lapisan keamanan ekstra pada akun Anda.</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-100 dark:bg-slate-700 rounded-full relative cursor-not-allowed opacity-50 flex-shrink-0">
                    <div className="w-4 h-4 bg-slate-400 rounded-full absolute left-1 top-1"></div>
                  </div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-600 dark:text-amber-400 flex gap-3 items-start">
                  <span className="font-bold text-amber-600 dark:text-amber-500">INFO:</span> 
                  <span>Fitur Autentikasi Dua Langkah (2FA) saat ini dikelola secara terpusat oleh administrator sistem RS Efarina.</span>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl shadow-black/5 dark:shadow-black/10 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell size={20} className="text-indigo-500 dark:text-indigo-400" />
                  Pengaturan Notifikasi
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pilih notifikasi apa saja yang ingin Anda terima.</p>
              </div>

              {message.text && (
                <div className={`p-3 rounded-xl text-sm font-medium border ${
                  message.type === 'error' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl">
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-medium">Pemberitahuan Sistem</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pembaruan dan jadwal pemeliharaan sistem.</p>
                  </div>
                  <div onClick={() => setNotifSystem(!notifSystem)} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifSystem ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifSystem ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl">
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-medium">Pemberitahuan Cuti</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Status pengajuan cuti dan pengingat.</p>
                  </div>
                  <div onClick={() => setNotifLeave(!notifLeave)} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifLeave ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifLeave ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl">
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-medium">Pemberitahuan Penggajian</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Notifikasi saat slip gaji bulanan diterbitkan.</p>
                  </div>
                  <div onClick={() => setNotifPayroll(!notifPayroll)} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifPayroll ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifPayroll ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                <button onClick={saveNotificationSettings} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          )}

          {/* THEME TAB */}
          {activeTab === "theme" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl shadow-black/5 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Moon size={20} className="text-indigo-500" />
                  Tampilan & Tema
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pilih tema antarmuka aplikasi sesuai kenyamanan mata Anda.</p>
              </div>

              {message.text && (
                <div className={`p-3 rounded-xl text-sm font-medium border ${
                  message.type === 'error' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* DARK MODE CARD */}
                <div onClick={() => handleChangeTheme('dark')} className={`group relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${theme === 'dark' ? 'border-indigo-500 bg-slate-800' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'}`}>
                  <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 dark:border-slate-600'}`}>
                    {theme === 'dark' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  
                  <div className="h-24 bg-slate-900 rounded-xl mb-4 border border-slate-700/50 p-3 flex flex-col gap-2 shadow-inner">
                    <div className="w-full h-2 bg-slate-800 rounded-full"></div>
                    <div className="w-2/3 h-2 bg-slate-800 rounded-full"></div>
                    <div className="w-1/2 h-3 bg-indigo-500/40 rounded-full mt-auto"></div>
                  </div>
                  
                  <h4 className={`font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-slate-500'}`}>Mode Gelap</h4>
                </div>

                {/* LIGHT MODE CARD */}
                <div onClick={() => handleChangeTheme('light')} className={`group relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${theme === 'light' ? 'border-indigo-500 bg-white shadow-lg' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'}`}>
                  <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'light' ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 dark:border-slate-600'}`}>
                    {theme === 'light' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  
                  <div className="h-24 bg-white rounded-xl mb-4 border border-slate-200 p-3 flex flex-col gap-2 shadow-inner">
                    <div className="w-full h-2 bg-slate-100 rounded-full"></div>
                    <div className="w-2/3 h-2 bg-slate-100 rounded-full"></div>
                    <div className="w-1/2 h-3 bg-indigo-400/40 rounded-full mt-auto"></div>
                  </div>
                  
                  <h4 className={`font-bold text-center ${theme === 'light' ? 'text-slate-900' : 'text-slate-500 dark:text-slate-400'}`}>Mode Terang</h4>
                </div>
              </div>
            </div>
          )}

          {/* LANGUAGE TAB */}
          {activeTab === "language" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl shadow-black/5 dark:shadow-black/10 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe size={20} className="text-indigo-500 dark:text-indigo-400" />
                  {t("pilih_bahasa")}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("pilih_bahasa")}</p>
              </div>

              {message.text && (
                <div className={`p-3 rounded-xl text-sm font-medium border ${
                  message.type === 'error' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="space-y-3">
                <label onClick={() => handleChangeLanguage('id')} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${currentLang === 'id' ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentLang === 'id' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>ID</div>
                    <div>
                      <h4 className={`${currentLang === 'id' ? 'text-indigo-600 dark:text-indigo-100' : 'text-slate-700 dark:text-white'} font-medium`}>{t("bahasa_indonesia")}</h4>
                      <p className={`text-xs mt-0.5 ${currentLang === 'id' ? 'text-indigo-500/70 dark:text-indigo-400/70' : 'text-slate-500 dark:text-slate-400'}`}>{t("bahasa_default")}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-4 ${currentLang === 'id' ? 'border-indigo-500 bg-white' : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800'}`}></div>
                </label>

                <label onClick={() => handleChangeLanguage('en')} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${currentLang === 'en' ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentLang === 'en' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>EN</div>
                    <div>
                      <h4 className={`${currentLang === 'en' ? 'text-indigo-600 dark:text-indigo-100' : 'text-slate-700 dark:text-white'} font-medium`}>{t("english_us")}</h4>
                      <p className={`text-xs mt-0.5 ${currentLang === 'en' ? 'text-indigo-500/70 dark:text-indigo-400/70' : 'text-slate-500 dark:text-slate-400'}`}>{t("internasional")}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-4 ${currentLang === 'en' ? 'border-indigo-500 bg-white' : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800'}`}></div>
                </label>
              </div>
            </div>
          )}

          {/* SYSTEM MANAGEMENT TAB */}
          {activeTab === "system" && userRole === "ADMIN" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl shadow-black/5 dark:shadow-black/10 animate-in fade-in duration-300 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders size={20} className="text-indigo-500 dark:text-indigo-400" />
                  Manajemen Sistem & Modul Enterprise
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Konfigurasi alur kerja monorepo, visibilitas menu sidebar, dan format auto-numbering Rumah Sakit.</p>
              </div>

              {message.text && (
                <div className={`p-3 rounded-xl text-sm font-medium border relative z-10 ${
                  message.type === 'error' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Sub-Tabs Navigation */}
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl relative z-10">
                <button
                  type="button"
                  onClick={() => setActiveSystemSubTab("modules")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                    activeSystemSubTab === "modules"
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                  }`}
                >
                  <Cpu size={14} />
                  Modul Aplikasi
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSystemSubTab("menus")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                    activeSystemSubTab === "menus"
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                  }`}
                >
                  <Menu size={14} />
                  Struktur Menu
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSystemSubTab("numbering")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                    activeSystemSubTab === "numbering"
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                  }`}
                >
                  <Hash size={14} />
                  Format Penomoran
                </button>
              </div>

              {/* SYSTEM SUB-TAB: MODULES */}
              {activeSystemSubTab === "modules" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 text-xs text-indigo-600 dark:text-indigo-300">
                    <span className="font-bold">Informasi:</span> Menonaktifkan modul akan menyembunyikan halaman dari navigasi dan memblokir akses fitur secara global bagi seluruh pengguna non-administrator.
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {systemModules.map((mod) => (
                      <div key={mod.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${mod.isActive ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                            {mod.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{mod.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleModule(mod.id)}
                          className={`w-12 h-6 rounded-full relative transition-colors ${mod.isActive ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${mod.isActive ? 'right-1' : 'left-1'}`}></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SYSTEM SUB-TAB: MENUS */}
              {activeSystemSubTab === "menus" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 text-xs text-indigo-600 dark:text-indigo-300">
                    <span className="font-bold">Informasi:</span> Sesuaikan posisi urutan menu di sidebar menggunakan tombol panah, atau edit hak akses role yang diizinkan untuk melihat menu tersebut.
                  </div>
                  <div className="space-y-3">
                    {systemMenus.map((menu, index) => (
                      <div key={menu.id} className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {/* Reordering buttons */}
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveMenu(index, 'up')}
                              className="p-1 text-slate-400 hover:text-slate-850 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-750 rounded disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              disabled={index === systemMenus.length - 1}
                              onClick={() => handleMoveMenu(index, 'down')}
                              className="p-1 text-slate-400 hover:text-slate-850 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-750 rounded disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <ArrowDown size={14} />
                            </button>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white capitalize">{t(menu.name)}</h4>
                              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 font-mono">{menu.href}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Ikon: <span className="font-mono">{menu.iconName}</span></p>
                          </div>
                        </div>

                        {/* Roles checkboxes */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Akses Hak Peran (Roles)</span>
                          <div className="flex flex-wrap gap-2">
                            {["ADMIN", "SDM", "KEUANGAN", "EMPLOYEE"].map(role => {
                              const isChecked = menu.roles.includes(role);
                              return (
                                <button
                                  type="button"
                                  key={role}
                                  onClick={() => handleToggleMenuRole(menu.id, role)}
                                  className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all ${
                                    isChecked
                                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold"
                                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                                  }`}
                                >
                                  {role}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Visibility toggle */}
                        <div className="flex items-center gap-2 self-end md:self-auto">
                          <button
                            type="button"
                            onClick={() => handleToggleMenu(menu.id)}
                            className={`p-2 rounded-xl border transition-all ${
                              menu.isActive
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-450"
                            }`}
                            title={menu.isActive ? "Sembunyikan menu" : "Tampilkan menu"}
                          >
                            {menu.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SYSTEM SUB-TAB: NUMBERING */}
              {activeSystemSubTab === "numbering" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 text-xs text-indigo-600 dark:text-indigo-300">
                    <span className="font-bold">Informasi:</span> Atur struktur kode penomoran dokumen di sistem monorepo Anda. Perubahan akan langsung tercermin secara dinamis saat pembuatan ID Pegawai, Slip Gaji, atau Formulir Cuti Baru.
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* EMPLOYEE NUMBERING */}
                    <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400"><Hash size={16} /></div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">ID Pegawai</h4>
                      </div>
                      
                      <div className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-slate-400 font-medium">Prefix</label>
                          <input
                            type="text"
                            value={systemNumbering.employee.prefix}
                            onChange={(e) => handleSaveNumberingSettings('employee', 'prefix', e.target.value)}
                            className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-medium">Delimiter</label>
                          <input
                            type="text"
                            value={systemNumbering.employee.delimiter}
                            onChange={(e) => handleSaveNumberingSettings('employee', 'delimiter', e.target.value)}
                            className="w-full bg-white dark:bg-slate-855 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-medium">Digit Urutan</label>
                          <input
                            type="number"
                            min="2"
                            max="8"
                            value={systemNumbering.employee.digits}
                            onChange={(e) => handleSaveNumberingSettings('employee', 'digits', parseInt(e.target.value) || 4)}
                            className="w-full bg-white dark:bg-slate-860 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        
                        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Live Preview:</span>
                          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block mt-1">
                            {`${systemNumbering.employee.prefix}${systemNumbering.employee.delimiter}HRD${systemNumbering.employee.delimiter}26${systemNumbering.employee.delimiter}${"1".padStart(systemNumbering.employee.digits, "0")}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PAYROLL SLIP NUMBERING */}
                    <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400"><Hash size={16} /></div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">ID Slip Gaji</h4>
                      </div>
                      
                      <div className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-slate-400 font-medium">Prefix</label>
                          <input
                            type="text"
                            value={systemNumbering.payroll.prefix}
                            onChange={(e) => handleSaveNumberingSettings('payroll', 'prefix', e.target.value)}
                            className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-medium">Delimiter</label>
                          <input
                            type="text"
                            value={systemNumbering.payroll.delimiter}
                            onChange={(e) => handleSaveNumberingSettings('payroll', 'delimiter', e.target.value)}
                            className="w-full bg-white dark:bg-slate-855 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-medium">Digit Urutan</label>
                          <input
                            type="number"
                            min="2"
                            max="8"
                            value={systemNumbering.payroll.digits}
                            onChange={(e) => handleSaveNumberingSettings('payroll', 'digits', parseInt(e.target.value) || 4)}
                            className="w-full bg-white dark:bg-slate-860 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        
                        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Live Preview:</span>
                          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block mt-1">
                            {`${systemNumbering.payroll.prefix}${systemNumbering.payroll.delimiter}052026${systemNumbering.payroll.delimiter}E8A1`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* LEAVE REQUEST NUMBERING */}
                    <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400"><Hash size={16} /></div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">ID Pengajuan Cuti</h4>
                      </div>
                      
                      <div className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-slate-400 font-medium">Prefix</label>
                          <input
                            type="text"
                            value={systemNumbering.leave.prefix}
                            onChange={(e) => handleSaveNumberingSettings('leave', 'prefix', e.target.value)}
                            className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-medium">Delimiter</label>
                          <input
                            type="text"
                            value={systemNumbering.leave.delimiter}
                            onChange={(e) => handleSaveNumberingSettings('leave', 'delimiter', e.target.value)}
                            className="w-full bg-white dark:bg-slate-855 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-medium">Digit Urutan</label>
                          <input
                            type="number"
                            min="2"
                            max="8"
                            value={systemNumbering.leave.digits}
                            onChange={(e) => handleSaveNumberingSettings('leave', 'digits', parseInt(e.target.value) || 3)}
                            className="w-full bg-white dark:bg-slate-860 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        
                        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Live Preview:</span>
                          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block mt-1">
                            {`${systemNumbering.leave.prefix}${systemNumbering.leave.delimiter}202605${systemNumbering.leave.delimiter}${"1".padStart(systemNumbering.leave.digits, "0")}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
