"use client";

import { useState } from "react";
import { LogIn, User, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Menembak ke API Gateway
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password.trim() 
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Simpan token (bisa localStorage atau HttpOnly Cookies nanti)
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_info", JSON.stringify(data.user));

      // Gunakan hard redirect untuk mendapatkan fresh state & hapus router next.js yang rentan error
      window.location.href = "/dashboard";
      
      // Tahan eksekusi agar state loading tidak berubah dan komponen tidak di-render ulang
      await new Promise(() => {});
    } catch (err: any) {
      setErrorMsg(err.message);
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
          <p className="text-slate-400 text-sm">Masuk ke Portal Terpadu RS Efarina</p>
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
