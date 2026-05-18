import * as XLSX from 'xlsx';
import { employeeService } from './employeeService';
import { Department, Position } from '../types/employee.types';

export const importService = {
  async importEmployeesFromExcel(
    file: File, 
    departments: Department[], 
    positions: Position[]
  ): Promise<{ success: number; error: number }> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) throw new Error("File Excel kosong.");

    let successCount = 0;
    let errorCount = 0;

    for (const row of jsonData) {
      try {
        const idPegawai = row["ID Pegawai"] || row["ID PEGAWAI"] || row["id_pegawai"];
        const name = row["Nama"] || row["NAMA"] || row["name"];
        const email = row["Email"] || row["EMAIL"] || row["email"];
        const deptName = row["Departemen"] || row["DEPARTEMEN"] || row["department"];
        const posName = row["Jabatan"] || row["JABATAN"] || row["position"];

        if (!name || !email) continue;

        const deptId = departments.find(d => d.name.toLowerCase() === String(deptName).toLowerCase())?.id || departments[0]?.id;
        const posId = positions.find(p => p.name.toLowerCase() === String(posName).toLowerCase())?.id || positions[0]?.id;

        await employeeService.createEmployee({
          id_pegawai: String(idPegawai || `PEG-IM-${Date.now().toString().slice(-4)}`),
          userId: `u-im-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: String(name),
          email: String(email),
          phoneNumber: String(row["No HP"] || ""),
          joinDate: new Date().toISOString(),
          department: { connect: { id: deptId } },
          position: { connect: { id: posId } }
        });
        successCount++;
      } catch {
        errorCount++;
      }
    }

    return { success: successCount, error: errorCount };
  },

  exportEmployeesToExcel(employees: any[]) {
    const dataToExport = employees.map(emp => ({
      "ID Pegawai": emp.id_pegawai || emp.id,
      "Nama": emp.name,
      "Email": emp.email,
      "No HP": emp.phoneNumber || "-",
      "Departemen": emp.department?.name || "-",
      "Jabatan": emp.position?.name || "-",
      "Tanggal Bergabung": new Date(emp.joinDate).toLocaleDateString('id-ID')
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 }, // ID Pegawai
      { wch: 25 }, // Nama
      { wch: 25 }, // Email
      { wch: 15 }, // No HP
      { wch: 20 }, // Departemen
      { wch: 20 }, // Jabatan
      { wch: 18 }, // Tanggal Bergabung
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pegawai");
    XLSX.writeFile(workbook, `Data_Pegawai_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }
};
