import React from 'react';
import { RekapSummary } from '../types/attendance.types';

interface Props {
  summary?: RekapSummary;
}

export const AttendanceStats: React.FC<Props> = ({ summary }) => {
  if (!summary) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
        <p className="text-sm font-medium text-emerald-400 mb-1">Total Hadir</p>
        <h4 className="text-2xl font-bold text-emerald-400">{summary.totalHadir}</h4>
      </div>
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
        <p className="text-sm font-medium text-amber-400 mb-1">Total Terlambat</p>
        <h4 className="text-2xl font-bold text-amber-400">{summary.totalTelat}</h4>
      </div>
      <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
        <p className="text-sm font-medium text-indigo-400 mb-1">Total Cuti/Izin</p>
        <h4 className="text-2xl font-bold text-indigo-400">{summary.totalCuti}</h4>
      </div>
      <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
        <p className="text-sm font-medium text-rose-400 mb-1">Total Alpha</p>
        <h4 className="text-2xl font-bold text-rose-400">{summary.totalAbsen}</h4>
      </div>
    </div>
  );
};
