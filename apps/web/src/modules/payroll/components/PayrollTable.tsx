import React from 'react';
import { CreditCard, Search, Printer, Download, Edit2, Trash2, Loader2 } from "lucide-react";
import { PayrollRecord } from '../types/payroll.types';

interface Props {
  records: PayrollRecord[];
  employees: any[];
  isLoading: boolean;
  errorMsg: string;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterPeriod: string;
  setFilterPeriod: (val: string) => void;
  userRole: string;
  onEdit: (record: PayrollRecord) => void;
  onDelete: (id: string) => void;
  onPrint: (record: PayrollRecord, action: 'download' | 'print') => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount).replace(/\u00A0/g, ' ');
};

export const PayrollTable: React.FC<Props> = ({
  records,
  employees,
  isLoading,
  errorMsg,
  searchTerm,
  setSearchTerm,
  filterPeriod,
  setFilterPeriod,
  userRole,
  onEdit,
  onDelete,
  onPrint
}) => {
  const filteredRecords = records.filter(r => {
    const emp = employees.find(e => e.id === r.userId || e.userId === r.userId) || {};
    const searchTarget = `${r.userId} ${emp.name || ""} ${emp.id_pegawai || ""}`.toLowerCase();
    const matchName = searchTarget.includes(searchTerm.toLowerCase());
    const matchPeriod = filterPeriod ? r.period.startsWith(filterPeriod) : true;
    return matchName && matchPeriod;
  });

  return (
    <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CreditCard className="text-slate-500 dark:text-slate-400" size={24} />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Riwayat Payroll</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari ID Pegawai..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
           </div>
           <input 
              type="month"
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-48 appearance-none"
           />
        </div>
      </div>
      
      <div className="p-0">
        {isLoading ? (
          <div className="p-8 flex flex-col justify-center items-center gap-3 text-indigo-600 dark:text-indigo-400">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Memuat data...</p>
          </div>
        ) : errorMsg ? (
          <div className="p-8 text-center text-rose-600 dark:text-rose-400 text-sm">{errorMsg}</div>
        ) : records.length === 0 ? (
           <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">Belum ada data penggajian.</div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
            {filteredRecords.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">Tidak ditemukan data yang cocok dengan filter.</div>
            ) : filteredRecords.map((r, i) => {
              const emp = employees.find(e => e.id === r.userId || e.userId === r.userId) || {};
              const displayId = emp.id_pegawai || r.userId;
              const displayName = emp.name || r.userId;
              
              return (
                <div key={r.id || i} className="flex flex-col sm:flex-row justify-between sm:items-center p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors gap-4">
                  <div>
                    <div className="font-mono text-sm text-slate-500 dark:text-slate-400 mb-1">#{r.id?.substring(0,8).toUpperCase() || 'PR00X'}</div>
                    <div className="text-slate-900 dark:text-white font-bold">{displayName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">ID: {displayId} | Periode: {new Date(r.period).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(Number(r.netSalary))}</div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        r.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
                        r.status === 'PROCESSED' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {r.status === 'PAID' ? 'Lunas' : r.status === 'PROCESSED' ? 'Diproses' : 'Draft'}
                      </span>
                      
                      <div className="flex items-center gap-1 ml-2 border-l border-slate-200 dark:border-slate-700 pl-3">
                        <button 
                          onClick={() => onPrint(r, 'print')}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          title="Cetak Langsung"
                        >
                          <Printer size={16} />
                        </button>
                        <button 
                          onClick={() => onPrint(r, 'download')}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                          title="Download Slip Gaji"
                        >
                          <Download size={16} />
                        </button>

                        {(userRole === "ADMIN" || userRole === "KEUANGAN") && (
                          <>
                            <button 
                              onClick={() => onEdit(r)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => onDelete(r.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
