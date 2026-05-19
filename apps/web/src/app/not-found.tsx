"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Timer untuk countdown
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect setelah 3 detik
    const timeout = setTimeout(() => {
      window.location.href = "/";
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0f172a] relative overflow-hidden">
      {/* Decorative center glow */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="z-10 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-10 rounded-2xl shadow-2xl text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
            <AlertCircle className="text-red-400" size={48} />
          </div>
        </div>
        
        <h1 className="text-6xl font-extrabold text-white mb-2 tracking-tight">404</h1>
        <h2 className="text-xl font-semibold text-slate-300 mb-6">Halaman Tidak Ditemukan</h2>
        
        <p className="text-slate-400 mb-8">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        
        <div className="inline-flex items-center justify-center rounded-full bg-slate-800/80 border border-slate-700 px-6 py-2.5 text-sm font-medium text-slate-300">
          Mengalihkan dalam <span className="text-indigo-400 font-bold w-4 text-center ml-1">{countdown}</span>...
        </div>
      </div>
    </div>
  );
}
