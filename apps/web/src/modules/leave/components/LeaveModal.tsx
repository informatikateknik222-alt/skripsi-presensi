import React from 'react';
import { X, Loader2 } from "lucide-react";
import { LeaveFormData } from '../types/leave.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formData: LeaveFormData;
  setFormData: (data: LeaveFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isFetchingEmployee: boolean;
  employeeData: any;
  onFetchEmployee: (id: string) => void;
  riwayatCuti: any[];
}

export const LeaveModal: React.FC<Props> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  isFetchingEmployee,
  employeeData,
  onFetchEmployee,
  riwayatCuti
}) => {
  if (!isOpen) return null;

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const s = new Date(formData.startDate);
    const e = new Date(formData.endDate);
    return Math.ceil((e.getTime() - s.getTime()) / (1000 * 3600 * 24)) + 1;
  };

  const getSisaCuti = () => {
    if (!employeeData) return 12;
    const empUserId = employeeData.userId || employeeData.id;
    const used = riwayatCuti
      .filter(c => c.userId === empUserId && c.status === "APPROVED" && c.type === "ANNUAL")
      .reduce((total, c) => {
         const start = new Date(c.startDate);
         const end = new Date(c.endDate);
         return total + Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
      }, 0);
    return Math.max(0, 12 - used);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Form Pengajuan Cuti</h3>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ID Pegawai</label>
            <div className="relative">
              <input 
                type="text" required value={formData.idPegawai}
                onChange={(e) => setFormData({...formData, idPegawai: e.target.value})}
                onBlur={(e) => onFetchEmployee(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="Contoh: PEG-001"
              />
              {isFetchingEmployee && <div className="absolute right-3 top-3 text-slate-400"><Loader2 size={18} className="animate-spin" /></div>}
            </div>
            {employeeData ? (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 p-3 rounded-xl mt-2 border border-emerald-500/20">
                <div className="flex justify-between items-start">
                  <div>
                    <strong className="text-sm text-emerald-700 dark:text-emerald-300">{employeeData.name}</strong>
                    <div className="text-emerald-600 dark:text-emerald-500/80">{employeeData.department?.name || '-'} &bull; {employeeData.position?.name || '-'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider mb-0.5">Sisa Cuti</div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{getSisaCuti()} Hari</div>
                  </div>
                </div>
              </div>
            ) : formData.idPegawai && !isFetchingEmployee && (
              <div className="text-xs text-rose-600 dark:text-rose-500 font-medium mt-1">Data pegawai tidak ditemukan</div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Jenis Cuti</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 appearance-none"
            >
              <option value="ANNUAL" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Cuti Tahunan</option>
              <option value="SICK" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Sakit</option>
              <option value="MATERNITY" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Cuti Melahirkan</option>
              <option value="UNPAID" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Izin Penting</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mulai</label>
              <input type="date" required value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Selesai</label>
              <input type="date" required value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500/50" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Alasan / Keterangan</label>
            <textarea required value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500/50 h-24"
              placeholder="Jelaskan alasan pengajuan cuti..." />
          </div>

          {formData.type === "SICK" && calculateDays() > 1 && (
            <div className="space-y-3">
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs p-3 rounded-xl">
                Cuti sakit &gt; 1 hari wajib menyertakan surat keterangan dokter.
              </div>
              <div className="p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/30">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2 uppercase">Upload Lampiran (Opsional)</label>
                <input type="file" accept="image/*,.pdf" 
                  onChange={(e) => setFormData({...formData, attachment: e.target.files?.[0] || undefined})}
                  className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-600 dark:file:text-indigo-400" />
              </div>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} disabled={isSubmitting}
              className="flex-1 px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Batal</button>
            <button type="submit" disabled={isSubmitting || !employeeData}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg active:scale-95">
              {isSubmitting ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Ajukan Cuti'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
