"use client";

import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    // Cek apakah user memiliki akses login
    const token = localStorage.getItem("access_token");
    
    // Timer kecil agar tidak berkedip terlalu cepat (opsional)
    const timeout = setTimeout(() => {
      if (token) {
        window.location.replace("/dashboard");
      } else {
        window.location.replace("/login");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Halaman tidak ditemukan (404)</h2>
      <p className="text-slate-500 text-sm">Sedang mengalihkan Anda ke halaman yang tepat...</p>
    </div>
  );
}
