// Force Recompile
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, User, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.replace("/dashboard");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      console.log("Auth Service removed, using dummy login for:", username);
      await new Promise(resolve => setTimeout(resolve, 800));

      const accountId = username.toLowerCase();
      
      // Cek sesi aktif (Simulasi Mencegah Multi-Login pada akun yang sama)
      const activeSessions = JSON.parse(localStorage.getItem("active_sessions") || "{}");
      
      if (activeSessions[accountId]) {
        throw new Error(`Akun "${username}" sedang login di perangkat/sesi lain. Harap keluar (logout) dari sesi tersebut terlebih dahulu.`);
      }

      const dummyUser = {
        id: "dummy-1",
        username: username || "admin",
        role: accountId === "admin" ? "ADMIN" :
              accountId.includes("sdm") ? "SDM" : 
              accountId.includes("keu") ? "KEUANGAN" : "EMPLOYEE",
        name: username || "Administrator"
      };

      // Daftarkan sesi aktif
      activeSessions[accountId] = true;
      localStorage.setItem("active_sessions", JSON.stringify(activeSessions));

      localStorage.setItem("access_token", "dummy-token-for-skripsi");
      localStorage.setItem("user_info", JSON.stringify(dummyUser));
      document.cookie = "access_token=dummy-token-for-skripsi; path=/; max-age=86400"; // 1 hari

      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat masuk.");
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/hospital-bg.png')" }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] z-0"></div>

      {/* Decorative Orbs */}
      <div className="absolute z-0 top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen"></div>
      <div className="absolute z-0 bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none mix-blend-screen"></div>
      
      <div className="w-full max-w-md rounded-2xl p-8 relative z-10 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 shadow-2xl transition-all duration-300 hover:shadow-indigo-500/10 hover:border-slate-600/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white p-3 mb-6 shadow-[0_0_25px_rgba(79,70,229,0.3)] ring-1 ring-white/10">
            <img src="/logo.png" alt="RS Efarina Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Selamat Datang</h1>
          <p className="text-slate-400 text-sm">Masuk ke Sistem RS Efarina</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm animate-pulse">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Nama Pengguna</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                placeholder="Masukkan username Anda"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-xl bg-indigo-600 text-white font-medium py-3.5 transition-all hover:bg-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Memproses...
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
