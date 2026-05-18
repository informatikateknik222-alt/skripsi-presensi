import React from 'react';
import { X, Loader2 } from "lucide-react";
import { PayrollFormData } from '../types/payroll.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  idPegawai: string;
  setIdPegawai: (val: string) => void;
  employeeData: any;
  isFetchingEmployee: boolean;
  onFetchEmployee: (id: string) => void;
  formData: PayrollFormData;
  setFormData: (data: PayrollFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount).replace(/\u00A0/g, ' ');
};

export const PayrollModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isEditMode,
  idPegawai,
  setIdPegawai,
  employeeData,
  isFetchingEmployee,
  onFetchEmployee,
  formData,
  setFormData,
  onSubmit,
  isSubmitting
}) => {
  if (!isOpen) return null;

  const calculateNetSalary = () => {
    return Number(formData.basicSalary) + Number(formData.totalAllowance) - Number(formData.totalDeduction) - Number(formData.bpjsDeduction) - Number(formData.taxDeduction);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 sticky top-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isEditMode ? 'Edit Slip Gaji' : 'Buat Slip Gaji Baru'}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="payrollForm" onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ID Pegawai</label>
              <div className="relative">
                <input 
                  type="text"
                  value={idPegawai}
                  onChange={(e) => setIdPegawai(e.target.value)}
                  onBlur={(e) => onFetchEmployee(e.target.value)}
                  disabled={isEditMode}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 dark:bg-slate-900/50 disabled:opacity-50"
                  placeholder="Contoh: PEG-001"
                  required
                />
                {isFetchingEmployee && <div className="absolute right-3 top-3 text-slate-400"><Loader2 size={18} className="animate-spin" /></div>}
              </div>
              {employeeData && !isEditMode ? (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 p-2 rounded-lg mt-1 border border-emerald-500/20">
                  Ditemukan: <strong>{employeeData.name || employeeData.userId}</strong>
                </div>
              ) : idPegawai && !isFetchingEmployee && !isEditMode ? (
                 <div className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">Tekan luar kolom untuk mencari pegawai.</div>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Periode (Bulan/Tahun)</label>
              <input 
                type="month"
                value={formData.period}
                onChange={(e) => setFormData({...formData, period: e.target.value})}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 dark:bg-slate-900/50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status Pembayaran</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 dark:bg-slate-900/50 appearance-none"
                required
              >
                <option value="DRAFT" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Draft</option>
                <option value="PROCESSED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Diproses</option>
                <option value="PAID" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Lunas (Paid)</option>
              </select>
            </div>

            <div className="my-4 border-t border-slate-200 dark:border-slate-700"></div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Gaji Pokok (Rp)</label>
              <input 
                type="number"
                min="0"
                value={formData.basicSalary}
                onChange={(e) => setFormData({...formData, basicSalary: Number(e.target.value)})}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 dark:bg-slate-900/50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tunjangan (Rp)</label>
                <input 
                  type="number"
                  min="0"
                  value={formData.totalAllowance}
                  onChange={(e) => setFormData({...formData, totalAllowance: Number(e.target.value)})}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 dark:bg-slate-900/50 font-medium"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pot. Lain/Terlambat (Rp)</label>
                <input 
                  type="number"
                  min="0"
                  value={formData.totalDeduction}
                  onChange={(e) => setFormData({...formData, totalDeduction: Number(e.target.value)})}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 dark:bg-slate-900/50 font-medium"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pot. BPJS (Rp)</label>
                <input 
                  type="number"
                  min="0"
                  value={formData.bpjsDeduction}
                  onChange={(e) => setFormData({...formData, bpjsDeduction: Number(e.target.value)})}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 dark:bg-slate-900/50 font-medium"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pot. Pajak PPh 21 (Rp)</label>
                <input 
                  type="number"
                  min="0"
                  value={formData.taxDeduction}
                  onChange={(e) => setFormData({...formData, taxDeduction: Number(e.target.value)})}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-50 dark:bg-slate-900/50 font-medium"
                  required
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex justify-between items-center">
              <span className="font-semibold text-indigo-900 dark:text-indigo-100">Gaji Bersih (Net)</span>
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(calculateNetSalary())}
              </span>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex gap-3 sticky bottom-0">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit"
            form="payrollForm"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-70 flex justify-center items-center"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Data"}
          </button>
        </div>
      </div>
    </div>
  );
};
