"use client";

import { Bell, Lock, Moon, Globe, Shield, Smartphone, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
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

  // Theme & Language State
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("id");

  // Load saved preferences on mount
  useEffect(() => {
    const savedNotifs = localStorage.getItem("notif_settings");
    if (savedNotifs) {
      try {
        const parsed = JSON.parse(savedNotifs);
        if (typeof parsed.system === "boolean") setNotifSystem(parsed.system);
        if (typeof parsed.leave === "boolean") setNotifLeave(parsed.leave);
        if (typeof parsed.payroll === "boolean") setNotifPayroll(parsed.payroll);
      } catch (e) {}
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);

    const savedLang = localStorage.getItem("language");
    if (savedLang) setLanguage(savedLang);
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
    if (newTheme === "light") {
      setMessage({ type: "error", text: "Mode Terang (Light Mode) saat ini masih dalam tahap pengembangan." });
    } else {
      setMessage({ type: "success", text: "Tema Gelap (Dark Mode) berhasil diaktifkan." });
    }
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleChangeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    if (lang === "en") {
      setMessage({ type: "error", text: "English language pack is currently in development." });
    } else {
      setMessage({ type: "success", text: "Bahasa sistem dikembalikan ke Bahasa Indonesia." });
    }
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
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:4000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengubah kata sandi");

      setMessage({ type: "success", text: "Kata sandi berhasil diperbarui!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Pengaturan</h1>
        <p className="text-slate-400 text-sm">Kelola preferensi dan pengaturan sistem keamanan akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Settings Menu */}
        <div className="col-span-1 space-y-2">
          <button 
            onClick={() => { setActiveTab("security"); setMessage({ type: "", text: "" }); }}
            className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${activeTab === 'security' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Lock size={18} />
            Keamanan Akun
          </button>
          <button 
            onClick={() => { setActiveTab("notifications"); setMessage({ type: "", text: "" }); }}
            className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${activeTab === 'notifications' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Bell size={18} />
            Notifikasi
          </button>
          <button 
            onClick={() => { setActiveTab("theme"); setMessage({ type: "", text: "" }); }}
            className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${activeTab === 'theme' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Moon size={18} />
            Tampilan (Tema)
          </button>
          <button 
            onClick={() => { setActiveTab("language"); setMessage({ type: "", text: "" }); }}
            className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${activeTab === 'language' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Globe size={18} />
            Bahasa
          </button>
        </div>

        {/* Setting Content */}
        <div className="col-span-2 space-y-6">
          
          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Security Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl shadow-black/10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield size={20} className="text-indigo-400" />
                    Ubah Kata Sandi
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Pastikan akun Anda menggunakan kata sandi yang kuat.</p>
                </div>

                <div className="space-y-4 relative">
                  {message.text && (
                    <div className={`p-3 rounded-xl text-sm font-medium border ${
                      message.type === 'error' 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {message.text}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Kata Sandi Saat Ini</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-slate-800 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Kata Sandi Baru</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-slate-800 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Konfirmasi Kata Sandi Baru</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-slate-800 transition-all" 
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex justify-end relative">
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
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl shadow-black/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Smartphone size={20} className="text-emerald-400" />
                      Autentikasi Dua Langkah (2FA)
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">Tambahkan lapisan keamanan ekstra pada akun Anda.</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-700 rounded-full relative cursor-not-allowed opacity-50 flex-shrink-0">
                    <div className="w-4 h-4 bg-slate-400 rounded-full absolute left-1 top-1"></div>
                  </div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-400 flex gap-3 items-start">
                  <span className="font-bold text-amber-500">INFO:</span> 
                  <span>Fitur Autentikasi Dua Langkah (2FA) saat ini dikelola secara terpusat oleh administrator sistem RS Efarina.</span>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl shadow-black/10 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bell size={20} className="text-indigo-400" />
                  Pengaturan Notifikasi
                </h2>
                <p className="text-sm text-slate-400 mt-1">Pilih notifikasi apa saja yang ingin Anda terima.</p>
              </div>

              {message.text && (
                <div className={`p-3 rounded-xl text-sm font-medium border ${
                  message.type === 'error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                  <div>
                    <h4 className="text-white font-medium">Pemberitahuan Sistem</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Pembaruan dan jadwal pemeliharaan sistem.</p>
                  </div>
                  <div onClick={() => setNotifSystem(!notifSystem)} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifSystem ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifSystem ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                  <div>
                    <h4 className="text-white font-medium">Pemberitahuan Cuti</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Status pengajuan cuti dan pengingat.</p>
                  </div>
                  <div onClick={() => setNotifLeave(!notifLeave)} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifLeave ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifLeave ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                  <div>
                    <h4 className="text-white font-medium">Pemberitahuan Penggajian</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Notifikasi saat slip gaji bulanan diterbitkan.</p>
                  </div>
                  <div onClick={() => setNotifPayroll(!notifPayroll)} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifPayroll ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifPayroll ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex justify-end">
                <button onClick={saveNotificationSettings} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          )}

          {/* THEME TAB */}
          {activeTab === "theme" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl shadow-black/10 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Moon size={20} className="text-indigo-400" />
                  Tampilan & Tema
                </h2>
                <p className="text-sm text-slate-400 mt-1">Pilih tema antarmuka aplikasi sesuai kenyamanan mata Anda.</p>
              </div>

              {message.text && (
                <div className={`p-3 rounded-xl text-sm font-medium border ${
                  message.type === 'error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div onClick={() => handleChangeTheme('dark')} className={`border-2 rounded-xl p-4 cursor-pointer relative overflow-hidden group transition-all ${theme === 'dark' ? 'border-indigo-500 bg-slate-800' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'}`}>
                  <div className={`absolute top-2 right-2 w-4 h-4 rounded-full border-4 ${theme === 'dark' ? 'border-indigo-500 bg-white' : 'border-slate-600 bg-slate-800'}`}></div>
                  <div className="h-20 bg-slate-900 rounded-lg mb-3 border border-slate-700 flex flex-col p-2 gap-1.5">
                    <div className="w-full h-2 bg-slate-800 rounded-sm"></div>
                    <div className="w-3/4 h-2 bg-slate-800 rounded-sm"></div>
                    <div className="w-1/2 h-2 bg-indigo-500/50 rounded-sm mt-auto"></div>
                  </div>
                  <h4 className={`font-medium text-center ${theme === 'dark' ? 'text-white' : 'text-slate-400'}`}>Mode Gelap</h4>
                </div>

                <div onClick={() => handleChangeTheme('light')} className={`border-2 rounded-xl p-4 cursor-pointer relative overflow-hidden transition-all ${theme === 'light' ? 'border-indigo-500 bg-slate-100' : 'border-slate-700 bg-slate-200/50 hover:bg-slate-200 opacity-70'}`}>
                  <div className={`absolute top-2 right-2 w-4 h-4 rounded-full border-4 ${theme === 'light' ? 'border-indigo-500 bg-white' : 'border-slate-400 bg-slate-200'}`}></div>
                  <div className="h-20 bg-slate-50 rounded-lg mb-3 border border-slate-200 flex flex-col p-2 gap-1.5">
                    <div className="w-full h-2 bg-slate-200 rounded-sm"></div>
                    <div className="w-3/4 h-2 bg-slate-200 rounded-sm"></div>
                    <div className="w-1/2 h-2 bg-indigo-400/50 rounded-sm mt-auto"></div>
                  </div>
                  <h4 className={`font-medium text-center ${theme === 'light' ? 'text-slate-800' : 'text-slate-500'}`}>Mode Terang</h4>
                </div>
              </div>
            </div>
          )}

          {/* LANGUAGE TAB */}
          {activeTab === "language" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl shadow-black/10 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe size={20} className="text-indigo-400" />
                  Pengaturan Bahasa
                </h2>
                <p className="text-sm text-slate-400 mt-1">Pilih bahasa utama untuk antarmuka aplikasi.</p>
              </div>

              {message.text && (
                <div className={`p-3 rounded-xl text-sm font-medium border ${
                  message.type === 'error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="space-y-3">
                <label onClick={() => handleChangeLanguage('id')} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${language === 'id' ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${language === 'id' ? 'bg-slate-800 text-white' : 'bg-slate-700 text-slate-300'}`}>ID</div>
                    <div>
                      <h4 className={`${language === 'id' ? 'text-indigo-100' : 'text-white'} font-medium`}>Bahasa Indonesia</h4>
                      <p className={`text-xs mt-0.5 ${language === 'id' ? 'text-indigo-400/70' : 'text-slate-400'}`}>Bahasa default sistem</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-4 ${language === 'id' ? 'border-indigo-500 bg-white' : 'border-slate-500 bg-slate-800'}`}></div>
                </label>

                <label onClick={() => handleChangeLanguage('en')} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${language === 'en' ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${language === 'en' ? 'bg-slate-800 text-white' : 'bg-slate-700 text-slate-300'}`}>EN</div>
                    <div>
                      <h4 className={`${language === 'en' ? 'text-indigo-100' : 'text-white'} font-medium`}>English (US)</h4>
                      <p className={`text-xs mt-0.5 ${language === 'en' ? 'text-indigo-400/70' : 'text-slate-400'}`}>Internasional</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-4 ${language === 'en' ? 'border-indigo-500 bg-white' : 'border-slate-500 bg-slate-800'}`}></div>
                </label>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
