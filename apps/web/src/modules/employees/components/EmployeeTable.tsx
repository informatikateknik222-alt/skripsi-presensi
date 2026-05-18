import React from 'react';
import { Search, Edit2, Trash2 } from "lucide-react";
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { Employee } from '../types/employee.types';

interface Props {
  employees: Employee[];
  isLoading: boolean;
  errorMsg: string;
  userRole: string;
  onEdit: (emp: Employee) => void;
  onDelete: (id: string, name: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export const EmployeeTable: React.FC<Props> = ({
  employees,
  isLoading,
  errorMsg,
  userRole,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm
}) => {
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.id_pegawai || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
        <div className="relative w-full max-w-sm group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            placeholder="Cari nama, email, atau ID..."
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map(i => <TableRowSkeleton key={i} />)}
          </div>
        ) : errorMsg ? (
          <div className="h-64 flex items-center justify-center text-rose-500 dark:text-rose-400 text-sm">{errorMsg}</div>
        ) : employees.length === 0 ? (
           <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">Belum ada data pegawai.</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">ID Pegawai</th>
                <th className="px-6 py-4 font-medium">Nama Pegawai</th>
                <th className="px-6 py-4 font-medium">Kontak</th>
                <th className="px-6 py-4 font-medium">Divisi & Pangkat</th>
                {(userRole === "ADMIN" || userRole === "SDM") && (
                  <th className="px-6 py-4 font-medium text-right">Tindakan</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {filteredEmployees.map((emp) => {
                const empId = emp.id_pegawai || emp.id || "";
                return (
                  <tr key={empId} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">{empId}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{emp.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Bergabung: {new Date(emp.joinDate).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700 dark:text-slate-300">{emp.email}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{emp.phoneNumber || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                          {emp.department?.name || '-'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                          {emp.position?.name || '-'}
                        </span>
                      </div>
                    </td>
                    {(userRole === "ADMIN" || userRole === "SDM") && (
                      <td className="px-6 py-4 text-right space-x-1">
                        <button onClick={() => onEdit(emp)} className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => onDelete(empId, emp.name)} className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                          <Trash2 size={16} />
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
    </div>
  );
};
