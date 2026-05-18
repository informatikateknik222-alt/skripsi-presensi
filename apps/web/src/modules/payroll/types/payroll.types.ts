export interface PayrollRecord {
  id: string;
  userId: string;
  period: string;
  basicSalary: number;
  totalAllowance: number;
  totalDeduction: number;
  bpjsDeduction: number;
  taxDeduction: number;
  netSalary: number;
  status: 'DRAFT' | 'PROCESSED' | 'PAID';
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string;
    id_pegawai?: string;
  };
}

export interface PayrollStats {
  totalPaid: number;
  paidCount: number;
  activeCycle: string;
  pendingCount: number;
}

export interface PayrollFormData {
  period: string;
  basicSalary: number;
  totalAllowance: number;
  totalDeduction: number;
  bpjsDeduction: number;
  taxDeduction: number;
  status: string;
}
