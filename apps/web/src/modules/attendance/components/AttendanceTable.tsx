import React from 'react';
import { Loader2, CheckCircle2, Clock, XCircle, AlertTriangle, Edit } from "lucide-react";
import { AttendanceRecord } from '../types/attendance.types';

interface Props {
  records: AttendanceRecord[];
  employeeMap: Record<string, string>;
  isLoading: boolean;
  userRole: string;
}

export const AttendanceTable: React.FC<Props> = ({
  records,
  employeeMap,
  isLoading,
  userRole
}) => {
  const isAdminOrSDM = userRole === 'ADMIN' || userRole === 'SDM';

  const handleKoreksiShift = (rec: any) => {
    const newShift = prompt(`Koreksi Shift untuk ${employeeMap[rec.userId] || rec.userId}\nMasukkan shift yang benar (Pagi/Siang/Malam/Libur):`, rec.shift || "");
    if (newShift) {
      // In a real app, this would call attendanceService.updateRecord()
      alert(`Shift berhasil dikoreksi menjadi ${newShift}. Sistem akan melakukan re-kalkulasi.`);
      // Reload page or mutate state to reflect changes (mocked here)
      window.location.reload();
    }
  };

  return (
    <div className="overflow-x-auto border border-slate-700/50 rounded-xl flex-1">
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center text-indigo-400 gap-3">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-sm text-slate-400">Memuat data...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          Tidak ada data presensi untuk periode ini.
        </div>
      ) : (
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-slate-900/50 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 font-medium">Pegawai ID</th>
              <th className="px-6 py-4 font-medium">Nama Pegawai</th>
              <th className="px-6 py-4 font-medium">Tanggal</th>
              <th className="px-6 py-4 font-medium">Masuk</th>
              <th className="px-6 py-4 font-medium">Keluar</th>
              <th className="px-6 py-4 font-medium">Shift</th>
              <th className="px-6 py-4 font-medium">Status</th>
              {isAdminOrSDM && <th className="px-6 py-4 font-medium text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {records.map((rec, i) => {
              // Simulate an anomaly for demonstration if shift is missing or weird
              const isAnomaly = rec.status === "UNKNOWN" || !rec.shift || rec.status === "ANOMALY";
              
              return (
                <tr key={i} className={`hover:bg-slate-900/50/80 transition-colors ${isAnomaly ? 'bg-amber-900/10' : ''}`}>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{rec.userId || '-'}</td>
                  <td className="px-6 py-4 font-medium text-slate-300">{employeeMap[rec.userId] || 'Unknown'}</td>
                  <td className="px-6 py-4 font-medium text-slate-300">
                    {new Date(rec.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-medium text-emerald-400">
                    {new Date(rec.checkIn).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-6 py-4 font-medium text-rose-500">
                    {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg border uppercase ${
                      isAnomaly ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-slate-700/50 text-slate-400 border-slate-700'
                    }`}>
                      {rec.shift || (isAnomaly ? 'ANOMALI' : 'N/A')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      rec.status === "PRESENT" ? 'bg-emerald-100/10 text-emerald-400' :
                      rec.status === "LATE" ? 'bg-amber-100/10 text-amber-400' :
                      isAnomaly ? 'bg-rose-100/10 text-rose-400' :
                      'bg-indigo-100/10 text-indigo-400'
                    }`}>
                      {rec.status === "PRESENT" ? <CheckCircle2 size={12} /> :
                       rec.status === "LATE" ? <Clock size={12} /> : 
                       isAnomaly ? <AlertTriangle size={12} /> :
                       <XCircle size={12} />}
                      {isAnomaly ? 'BUTUH VALIDASI' : rec.status}
                    </span>
                  </td>
                  {isAdminOrSDM && (
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleKoreksiShift(rec)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isAnomaly 
                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm' 
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        <Edit size={14} />
                        Koreksi
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
