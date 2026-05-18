import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../services/attendanceService';
import { AttendanceRecord, RekapData } from '../types/attendance.types';

export const useAttendance = (activeTab: string) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [rekapData, setRekapData] = useState<RekapData>({ data: [] });
  const [employeeMap, setEmployeeMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasClockedInToday, setHasClockedInToday] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      const data = await attendanceService.getEmployees();
      const map: Record<string, string> = {};
      data.forEach((emp: any) => {
        if (emp.id_pegawai) map[emp.id_pegawai] = emp.name;
        if (emp.userId) map[emp.userId] = emp.name;
      });
      setEmployeeMap(map);
    } catch (err) {
      console.error("Gagal memuat data pegawai", err);
    }
  }, []);

  const fetchAttendanceData = useCallback(async (tab: string) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const data = await attendanceService.getAttendance(tab);

      if (tab === "log") {
        const recordsData = Array.isArray(data) ? data : [];
        setRecords(recordsData);
        
        // Cek apakah user sudah absen hari ini
        const today = new Date().toISOString().split('T')[0];
        const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
        const clockedIn = recordsData.some(r => r.date.startsWith(today) && r.userId === userInfo.userId);
        setHasClockedInToday(clockedIn);
      } else {
        setRekapData(data);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      
      // Fallback DUMMY DATA if needed (matching original logic)
      if (tab === "log") {
        setRecords([
          { id: "1", date: new Date().toISOString(), checkIn: new Date(new Date().setHours(7, 45, 0, 0)).toISOString(), checkOut: null, status: "PRESENT", notes: "Hadir", userId: "USER-123" }
        ]);
      } else {
        setRekapData({
          summary: { totalHadir: 45, totalTelat: 3, totalAbsen: 0, totalCuti: 2 },
          data: []
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchAttendanceData(activeTab);
  }, [activeTab, fetchAttendanceData]);

  return {
    records,
    rekapData,
    employeeMap,
    isLoading,
    errorMsg,
    hasClockedInToday,
    setHasClockedInToday,
    refresh: () => fetchAttendanceData(activeTab)
  };
};
