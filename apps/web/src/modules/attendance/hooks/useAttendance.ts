import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { attendanceService } from '../services/attendanceService';
import { AttendanceRecord, RekapData } from '../types/attendance.types';

export const useAttendance = (activeTab: string) => {
  const [hasClockedInToday, setHasClockedInToday] = useState(false);

  // 1. Fetch Employees using React Query (Cached for 5 minutes)
  const { data: employeesData = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => attendanceService.getEmployees(),
    staleTime: 5 * 60 * 1000, 
  });

  // Construct employee map
  const employeeMap = useMemo(() => {
    const map: Record<string, string> = {};
    employeesData.forEach((emp: any) => {
      if (emp.id_pegawai) map[emp.id_pegawai] = emp.name;
      if (emp.userId) map[emp.userId] = emp.name;
    });
    return map;
  }, [employeesData]);

  // 2. Fetch Attendance using React Query (Real-time polling if tab is 'log')
  const { 
    data: attendanceData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['attendance', activeTab],
    queryFn: () => attendanceService.getAttendance(activeTab),
    refetchInterval: activeTab === 'log' ? 3000 : false, // Real-time polling every 3s ONLY for log
  });

  // 3. Process Data
  const records = useMemo(() => {
    if (activeTab === "log") {
      const recs = Array.isArray(attendanceData) ? attendanceData : [];
      
      // Update hasClockedInToday
      try {
        const today = new Date().toISOString().split('T')[0];
        const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
        const clockedIn = recs.some(r => r.date.startsWith(today) && r.userId === userInfo.userId);
        // We set it inside useMemo, but ideally this should be a side-effect or derived state
        if (clockedIn !== hasClockedInToday) setHasClockedInToday(clockedIn);
      } catch(e) {}
      
      return recs;
    }
    return [];
  }, [attendanceData, activeTab, hasClockedInToday]);

  const rekapData: RekapData = useMemo(() => {
    if (activeTab !== "log" && attendanceData) {
       return attendanceData as RekapData;
    }
    return { data: [] };
  }, [attendanceData, activeTab]);

  return {
    records,
    rekapData,
    employeeMap,
    isLoading,
    errorMsg: error ? error.message : "",
    hasClockedInToday,
    setHasClockedInToday,
    refresh: refetch
  };
};
