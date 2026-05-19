"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";

export default function PortalPage() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/hospital-bg.png')" }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[4px] z-0"></div>

      {/* Decorative Orbs */}
      <div className="absolute z-0 top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen"></div>
      <div className="absolute z-0 bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none mix-blend-screen"></div>
      
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Main Container without the black card */}
        <div className="w-full p-10 md:p-12 text-center flex flex-col items-center">
          
          {/* Logo Section */}
          <div className="w-48 h-48 md:w-56 md:h-56 mb-12 animate-fade-in-up flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="RS Efarina Logo" 
              className="w-full h-full object-contain drop-shadow-2xl rounded-full bg-transparent" 
            />
          </div>

          {/* Action Button */}
          <div className="animate-fade-in-up w-full max-w-sm" style={{ animationDelay: "100ms" }}>
            <Link 
              href="/login"
              className="group relative flex w-full items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg py-4 px-8 rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] hover:-translate-y-1"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
              <LogIn className="w-6 h-6 transition-transform group-hover:scale-110" />
              <span>Masuk ke Sistem (Login)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
