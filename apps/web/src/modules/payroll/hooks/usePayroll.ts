import { useState, useEffect, useCallback } from 'react';
import { payrollService } from '../services/payrollService';
import { PayrollRecord, PayrollStats } from '../types/payroll.types';

export const usePayroll = () => {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [stats, setStats] = useState<PayrollStats>({
    totalPaid: 0,
    paidCount: 0,
    activeCycle: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
    pendingCount: 0
  });

  const fetchPayrollData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      // Fetch concurrently but handle individually if needed
      const [recordsResult, employeesResult] = await Promise.allSettled([
        payrollService.getRecords(),
        payrollService.getEmployees()
      ]);
      
      if (recordsResult.status === 'fulfilled' && Array.isArray(recordsResult.value)) {
        const recordsData = recordsResult.value;
        setRecords(recordsData);
        
        let totalPaid = 0;
        let paidCount = 0;
        let pendingCount = 0;
        
        recordsData.forEach((r: PayrollRecord) => {
          if (r.status === "PAID") {
            totalPaid += Number(r.netSalary);
            paidCount += 1;
          } else {
            pendingCount += 1;
          }
        });
        
        setStats(prev => ({
          ...prev,
          totalPaid,
          paidCount,
          pendingCount
        }));
      } else {
        setErrorMsg(recordsResult.reason.message);
        if (recordsResult.reason.message.includes("401")) {
          window.location.href = "/login";
        }
      }
      
      if (employeesResult.status === 'fulfilled' && Array.isArray(employeesResult.value)) {
        setEmployees(employeesResult.value);
      } else if (employeesResult.status === 'fulfilled') {
        console.warn("Employees data is not an array:", employeesResult.value);
        setEmployees([]);
      } else {
        console.warn("Failed to fetch employees:", employeesResult.reason.message);
      }

    } catch (err: any) {
      setErrorMsg("Terjadi kesalahan sistem yang tidak terduga.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayrollData();
  }, [fetchPayrollData]);

  return {
    records,
    employees,
    isLoading,
    errorMsg,
    stats,
    refresh: fetchPayrollData,
    setRecords,
    setErrorMsg
  };
};
