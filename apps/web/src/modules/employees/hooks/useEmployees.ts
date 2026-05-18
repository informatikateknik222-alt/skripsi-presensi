import { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employeeService';
import { Employee, Department, Position } from '../types/employee.types';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const [dataEmp, dataDep, dataPos] = await Promise.all([
        employeeService.getEmployees(),
        employeeService.getDepartments(),
        employeeService.getPositions(),
      ]);

      setEmployees(dataEmp);
      setDepartments(dataDep);
      setPositions(dataPos);
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
    fetchData();
  }, [fetchData]);

  const stats = {
    total: employees.length,
    newThisMonth: employees.filter(emp => {
      const joinDate = new Date(emp.joinDate);
      const now = new Date();
      return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
    }).length,
    totalDepartments: departments.length,
    totalPositions: positions.length
  };

  return {
    employees,
    departments,
    positions,
    isLoading,
    errorMsg,
    stats,
    refresh: fetchData,
    setEmployees
  };
};
