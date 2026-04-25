export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0f172a] relative overflow-hidden">
      {/* Decorative center glow */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="text-center z-10 space-y-6 max-w-2xl">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo RS Efarina" className="h-32 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">RS Efarina</span>
        </h1>
        <div className="pt-8">
          <a href="/login" className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-8 py-3.5 font-semibold transition-all hover:bg-slate-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            Masuk ke Portal Login
          </a>
        </div>
      </div>
    </div>
  );
}
