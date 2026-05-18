import { useState, useEffect, useCallback } from 'react';
import { leaveService } from '../services/leaveService';
import { LeaveRequest } from '../types/leave.types';

export const useLeave = () => {
  const [riwayatCuti, setRiwayatCuti] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchEmployees = useCallback(async () => {
    try {
      const data = await leaveService.getEmployees();
      setEmployees(data);
    } catch (err) {
      console.warn("Gagal memuat data pegawai", err);
    }
  }, []);

  const fetchLeaveRequests = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const data = await leaveService.getLeaveRequests();
      setRiwayatCuti(data);
    } catch (err: any) {
      setErrorMsg(err.message);
      if (err.message.includes("401")) {
        window.location.href = "/login";
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaveRequests();
    fetchEmployees();
  }, [fetchLeaveRequests, fetchEmployees]);

  return {
    riwayatCuti,
    employees,
    isLoading,
    errorMsg,
    refresh: fetchLeaveRequests,
    setRiwayatCuti
  };
};
