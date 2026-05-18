export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
  notes: string | null;
  userId: string;
  shift?: string;
}

export interface RekapSummary {
  totalHadir: number;
  totalTelat: number;
  totalAbsen: number;
  totalCuti: number;
}

export interface RekapData {
  summary?: RekapSummary;
  data: AttendanceRecord[];
}
