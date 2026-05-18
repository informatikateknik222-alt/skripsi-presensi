import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

export const useDashboard = (role: string, userId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState({ totalPegawai: 0, hadirHariIni: 0, sedangCuti: 0, terlambat: 0 });
  const [keuanganData, setKeuanganData] = useState({ totalPaid: 0, paidCount: 0, pendingCount: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [weeklyAttendance, setWeeklyAttendance] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (role === "ADMIN" || role === "SDM") {
        const data = await dashboardService.getAdminStats();
        setAdminData(data);
      } else if (role === "KEUANGAN") {
        const [adminStats, keuanganStats] = await Promise.all([
          dashboardService.getAdminStats(),
          dashboardService.getKeuanganStats()
        ]);
        setAdminData(adminStats);
        setKeuanganData(prev => ({ ...prev, ...keuanganStats }));
      }
      
      const [activities, weekly] = await Promise.all([
        dashboardService.getRecentActivities(),
        dashboardService.getWeeklyAttendance()
      ]);
      setRecentActivities(activities);
      setWeeklyAttendance(weekly?.data || []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [role, userId]);

  useEffect(() => {
    if (role) fetchData();
  }, [fetchData, role]);

  return {
    isLoading,
    adminData,
    keuanganData,
    recentActivities,
    weeklyAttendance,
    refresh: fetchData
  };
};
