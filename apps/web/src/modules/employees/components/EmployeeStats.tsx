import React from 'react';
import { Users, UserCheck, Building, Briefcase } from "lucide-react";
import { CardSkeleton } from '@/components/ui/Skeleton';

interface Props {
  stats: {
    total: number;
    newThisMonth: number;
    totalDepartments: number;
    totalPositions: number;
  };
  isLoading?: boolean;
}

export const EmployeeStats: React.FC<Props> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
      </div>
    );
  }
  const statCards = [
    { 
      title: "Total Pegawai", 
      value: stats.total.toString(), 
      icon: Users, 
      color: "text-blue-600 dark:text-blue-400", 
      bg: "bg-blue-500/10",
      desc: "Organik & Kontrak"
    },
    { 
      title: "Pegawai Baru", 
      value: stats.newThisMonth.toString(), 
      icon: UserCheck, 
      color: "text-emerald-600 dark:text-emerald-400", 
      bg: "bg-emerald-500/10",
      desc: "Bulan ini"
    },
    { 
      title: "Total Unit", 
      value: stats.totalDepartments.toString(), 
      icon: Building, 
      color: "text-amber-600 dark:text-amber-400", 
      bg: "bg-amber-500/10",
      desc: "Departemen Aktif"
    },
    { 
      title: "Total Jabatan", 
      value: stats.totalPositions.toString(), 
      icon: Briefcase, 
      color: "text-indigo-600 dark:text-indigo-400", 
      bg: "bg-indigo-500/10",
      desc: "Struktur Jabatan"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stat.value}</h3>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-tight">{stat.desc}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
