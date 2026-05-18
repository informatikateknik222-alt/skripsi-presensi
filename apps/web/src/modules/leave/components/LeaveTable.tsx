import React from 'react';
import { FileText, Printer, Download, Trash2 } from "lucide-react";
import { LeaveRequest } from '../types/leave.types';

interface Props {
  riwayatCuti: LeaveRequest[];
  employees: any[];
  isLoading: boolean;
  errorMsg: string;
  userRole: string;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onPrint: (cuti: LeaveRequest, action: 'print' | 'download') => void;
}

export const LeaveTable: React.FC<Props> = ({
  riwayatCuti,
  employees,
  isLoading,
  errorMsg,
  userRole,
  onUpdateStatus,
  onDelete,
  onPrint
}) => {
  const typeLabels: Record<string, string> = {
    'ANNUAL': 'Cuti Tahunan',
    'SICK': 'Sakit',
    'MATERNITY': 'Cuti Melahirkan',
    'UNPAID': 'Izin Penting'
  };

  const statusLabels: Record<string, string> = {
    'APPROVED': 'Disetujui',
    'REJECTED': 'Ditolak',
    'PENDING': 'Menunggu'
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700/50 text-sm font-medium text-slate-500 dark:text-slate-400">
            <th className="pb-3 font-semibold">Pegawai</th>
            <th className="pb-3 font-semibold">Jenis Cuti</th>
            <th className="pb-3 font-semibold">Tanggal</th>
            <th className="pb-3 font-semibold">Durasi</th>
            <th className="pb-3 font-semibold">Status</th>
            <th className="pb-3 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-sm text-slate-600 dark:text-slate-300">
          {isLoading ? (
            <tr><td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">Memuat data...</td></tr>
          ) : errorMsg ? (
            <tr><td colSpan={6} className="py-8 text-center text-rose-600 dark:text-rose-500">{errorMsg}</td></tr>
          ) : riwayatCuti.length === 0 ? (
            <tr><td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">Belum ada riwayat cuti</td></tr>
          ) : (
            riwayatCuti.map((cuti) => {
              const emp = employees.find(e => e.userId === cuti.userId || e.id === cuti.userId) || {};
              const displayName = emp.name || cuti.userId;
              const displayId = emp.id_pegawai || cuti.userId;
              
              const startDate = new Date(cuti.startDate);
              const endDate = new Date(cuti.endDate);
              const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;

              return (
                <tr key={cuti.id} className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="font-bold text-slate-900 dark:text-white">{displayName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">ID: {displayId}</div>
                  </td>
                  <td className="py-4 font-medium flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"><FileText size={16} /></div>
                    {typeLabels[cuti.type] || cuti.type}
                  </td>
                  <td className="py-4">
                    {startDate.toLocaleDateString('id-ID', {day:'numeric', month:'short'})} - {endDate.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})}
                  </td>
                  <td className="py-4">{days} Hari</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      cuti.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 
                      cuti.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {statusLabels[cuti.status]}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onPrint(cuti, 'print')} className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Cetak Langsung"><Printer size={16} /></button>
                      <button onClick={() => onPrint(cuti, 'download')} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors" title="Download PDF"><Download size={16} /></button>
                      
                      {(userRole === "ADMIN" || userRole === "SDM") && cuti.status === "PENDING" && (
                        <>
                          <button onClick={() => onUpdateStatus(cuti.id, 'APPROVED')} className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors ml-1">Setujui</button>
                          <button onClick={() => onUpdateStatus(cuti.id, 'REJECTED')} className="px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-lg border border-rose-500/20 hover:bg-rose-500/20 transition-colors ml-1">Tolak</button>
                        </>
                      )}
                      
                      {(userRole === "ADMIN" || userRole === "SDM" || cuti.status === "PENDING") && (
                        <button onClick={() => onDelete(cuti.id)} className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors ml-1" title="Hapus"><Trash2 size={16} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
