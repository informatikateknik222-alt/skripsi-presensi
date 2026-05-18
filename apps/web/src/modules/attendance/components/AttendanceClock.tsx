import React, { useState, useEffect } from 'react';
import { Calendar, Fingerprint, Loader2, Clock } from "lucide-react";

interface Props {
  hasClockedInToday: boolean;
  onClockInOut: (shift: string) => void;
  isClocking: boolean;
  selectedShift: string;
  setSelectedShift: (shift: string) => void;
}

export const AttendanceClock: React.FC<Props> = ({
  hasClockedInToday,
  onClockInOut,
  isClocking,
  selectedShift,
  setSelectedShift
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateString = currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="xl:col-span-1 bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden group">
      <div className="relative z-10 w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 mb-6">
          <Calendar size={14} className="text-indigo-400" />
          <span className="text-sm font-medium text-slate-300">{dateString}</span>
        </div>

        <div className="text-5xl font-bold text-white tracking-wider font-mono mb-8">
          {timeString.replace(/\./g, ':')}
        </div>

        <button
          onClick={() => onClockInOut(selectedShift)}
          disabled={isClocking}
          className={`relative w-48 h-48 mx-auto rounded-full flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
            isClocking ? 'bg-slate-100 border-4 border-slate-700 scale-95' 
            : hasClockedInToday 
              ? 'bg-gradient-to-br from-rose-500 hover:from-rose-600 to-red-600 hover:to-red-700 border-4 border-rose-500/20'
              : 'bg-gradient-to-br from-emerald-400 hover:from-emerald-500 to-teal-500 hover:to-teal-600 border-4 border-emerald-500/20'
          }`}
        >
          {!isClocking && (
             <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${hasClockedInToday ? 'bg-rose-500/100' : 'bg-emerald-400'}`} />
          )}

          {isClocking ? (
            <Loader2 size={48} className="text-slate-400 animate-spin opacity-80" />
          ) : (
            <Fingerprint size={56} className="text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
          )}
          
          <span className={`text-lg font-bold tracking-widest uppercase ${isClocking ? 'text-slate-400' : 'text-white'}`}>
            {isClocking ? "Processing" : hasClockedInToday ? "Clock Out" : "Clock In"}
          </span>
        </button>

        <div className="mt-8 mb-4 w-full">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 text-center">Pilih Shift Kerja</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'pagi', name: 'Pagi', time: '07:30 - 15:00' },
              { id: 'siang', name: 'Siang', time: '14:00 - 21:00' },
              { id: 'malam', name: 'Malam', time: '19:00 - 09:00' },
              { id: 'general', name: 'General', time: '07:30 - 17:00' }
            ].map((shift) => (
              <button
                key={shift.id}
                onClick={() => setSelectedShift(shift.id)}
                className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                  selectedShift === shift.id 
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                    : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:border-slate-600'
                }`}
              >
                <span className="text-xs font-bold">{shift.name}</span>
                <span className="text-[10px] opacity-70">{shift.time}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <Clock size={16} />
          <span>Berdasarkan Waktu Server (WIB)</span>
        </div>
      </div>
    </div>
  );
};
