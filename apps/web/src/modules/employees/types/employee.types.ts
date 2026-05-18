export interface Department {
  id: string;
  name: string;
}

export interface Position {
  id: string;
  name: string;
}

export interface Employee {
  id?: string;
  id_pegawai?: string;
  name: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
  positionId: string;
  department: { name: string };
  position: { name: string };
  joinDate: string;
}

export interface EmployeeFormData {
  id_pegawai: string;
  name: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
  positionId: string;
  joinDate: string;
}
