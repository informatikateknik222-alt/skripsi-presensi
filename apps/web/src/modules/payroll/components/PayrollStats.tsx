import React from 'react';
import { DollarSign, Users, TrendingUp, FileText } from "lucide-react";
import { PayrollStats as PayrollStatsType } from '../types/payroll.types';

interface Props {
  stats: PayrollStatsType;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount).replace(/\u00A0/g, ' ');
};

export const PayrollStats: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-1 transition-transform">
        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4">
          <DollarSign size={24} />
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Gaji Dibayar</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(stats.totalPaid)}</h3>
      </div>
      
      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-1 transition-transform">
        <div className="w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
          <Users size={24} />
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Pegawai Dibayar</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.paidCount}</h3>
      </div>
      
      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-1 transition-transform">
        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4">
          <TrendingUp size={24} />
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Siklus Aktif</p>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{stats.activeCycle}</h3>
      </div>
      
      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-1 transition-transform">
        <div className="w-12 h-12 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-4">
          <FileText size={24} />
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Status Pending</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pendingCount}</h3>
      </div>
    </div>
  );
};
