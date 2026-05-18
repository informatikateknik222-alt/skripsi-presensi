export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LeaveType = 'ANNUAL' | 'SICK' | 'MATERNITY' | 'UNPAID';

export interface LeaveRequest {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  type: LeaveType;
  reason: string;
  status: LeaveStatus;
  attachmentBase64?: string;
  createdAt: string;
}

export interface LeaveFormData {
  idPegawai: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  attachment?: File;
}
