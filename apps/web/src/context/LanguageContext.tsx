"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Import dictionaries
const id = {
  // Sidebar
  "dashboard": "Dashboard",
  "presensi": "Presensi",
  "penggajian": "Penggajian",
  "cuti": "Cuti",
  "pegawai": "Data Pegawai",
  "pengaturan": "Pengaturan",
  "keluar": "Keluar",
  
  // Dashboard
  "selamat_datang": "Selamat Datang",
  "ringkasan_data": "Ringkasan data keuangan dan penggajian hari ini.",
  "total_gaji": "Total Gaji Dibayar",
  "pegawai_dibayar": "Pegawai Dibayar",
  "total_pegawai": "Total Pegawai",
  "status_pending": "Status Pending",
  "grafik_kehadiran": "Grafik Kehadiran Mingguan",
  "aktivitas_terkini": "Aktivitas Terkini",
  
  // Settings
  "keamanan_akun": "Keamanan Akun",
  "notifikasi": "Notifikasi",
  "tampilan_tema": "Tampilan (Tema)",
  "bahasa": "Bahasa",
  "ubah_kata_sandi": "Ubah Kata Sandi",
  "simpan_perubahan": "Simpan Perubahan",
  "pilih_bahasa": "Pilih bahasa utama untuk antarmuka aplikasi.",
  "bahasa_indonesia": "Bahasa Indonesia",
  "bahasa_default": "Bahasa default sistem",
  "english_us": "English (US)",
  "internasional": "International",
  "bahasa_success": "Bahasa berhasil diubah!",
};

const en = {
  // Sidebar
  "dashboard": "Dashboard",
  "presensi": "Attendance",
  "penggajian": "Payroll",
  "cuti": "Leave Requests",
  "pegawai": "Employees",
  "pengaturan": "Settings",
  "keluar": "Logout",
  
  // Dashboard
  "selamat_datang": "Welcome",
  "ringkasan_data": "Summary of financial and payroll data today.",
  "total_gaji": "Total Salary Paid",
  "pegawai_dibayar": "Paid Employees",
  "total_pegawai": "Total Employees",
  "status_pending": "Pending Status",
  "grafik_kehadiran": "Weekly Attendance Chart",
  "aktivitas_terkini": "Recent Activities",

  // Settings
  "keamanan_akun": "Account Security",
  "notifikasi": "Notifications",
  "tampilan_tema": "Display (Theme)",
  "bahasa": "Language",
  "ubah_kata_sandi": "Change Password",
  "simpan_perubahan": "Save Changes",
  "pilih_bahasa": "Select the primary language for the application interface.",
  "bahasa_indonesia": "Indonesian",
  "bahasa_default": "Default system language",
  "english_us": "English (US)",
  "internasional": "International",
  "bahasa_success": "Language successfully changed!",
};

const translations: any = { id, en };

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = useState("id");

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) setLangState(savedLang);
  }, []);

  const setLanguage = (lang: string) => {
    setLangState(lang);
    localStorage.setItem("language", lang);
    window.dispatchEvent(new Event("languageChange"));
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
