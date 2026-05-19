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
    
    // Convert to array of arrays to find the actual header row
    const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    let headerRowIndex = 0;
    for (let i = 0; i < rawData.length; i++) {
      const rowStr = String(rawData[i]).toLowerCase();
      if (rowStr.includes("nama") && rowStr.includes("email")) {
        headerRowIndex = i;
        break;
      }
    }

    // Parse the JSON data starting from the correct header row
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { range: headerRowIndex });

    if (jsonData.length === 0) throw new Error("File Excel kosong atau format tidak sesuai.");

    let successCount = 0;
    let errorCount = 0;

    for (const row of jsonData) {
      try {
        const idPegawai = row["ID Pegawai"] || row["ID PEGAWAI"] || row["id_pegawai"] || row["ID"];
        const name = row["Nama Lengkap"] || row["Nama"] || row["NAMA"] || row["name"];
        const email = row["Email"] || row["EMAIL"] || row["email"];
        const deptName = row["Departemen"] || row["DEPARTEMEN"] || row["department"];
        const posName = row["Jabatan"] || row["JABATAN"] || row["position"];
        const noHp = row["No. Handphone"] || row["No HP"] || row["no_hp"] || row["phone"];

        if (!name || !email) continue;

        const deptId = departments.find(d => d.name.toLowerCase() === String(deptName).toLowerCase())?.id || departments[0]?.id;
        const posId = positions.find(p => p.name.toLowerCase() === String(posName).toLowerCase())?.id || positions[0]?.id;

        await employeeService.createEmployee({
          id_pegawai: String(idPegawai || `PEG-IM-${Date.now().toString().slice(-4)}`),
          userId: `u-im-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: String(name),
          email: String(email),
          phoneNumber: String(noHp || ""),
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

  async exportEmployeesToExcel(employees: any[]) {
    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Direktori Pegawai', {
        views: [{ showGridLines: false }],
        pageSetup: {
          paperSize: 9, // A4
          orientation: 'portrait',
          fitToPage: true,
          fitToWidth: 1,
          fitToHeight: 0,
          horizontalCentered: true,
          margins: { left: 0.2, right: 0.2, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 }
        }
      });

      // 1. Setup Logo
      try {
        const response = await fetch('/logo.png');
        if (response.ok) {
          const imageBlob = await response.blob();
          const arrayBuffer = await imageBlob.arrayBuffer();
          const logoId = workbook.addImage({
            buffer: arrayBuffer,
            extension: 'png',
          });
          
          worksheet.addImage(logoId, {
            tl: { col: 0.15, row: 0.1 },
            ext: { width: 45, height: 45 }
          });
        }
      } catch (e) {
        console.warn("Could not load logo for Excel", e);
      }

      // 2. Hospital Header
      worksheet.getRow(1).height = 20; 
      worksheet.mergeCells('B1:H1');
      const titleCell = worksheet.getCell('B1');
      titleCell.value = 'RUMAH SAKIT EFARINA ETAHAM KARAWANG';
      titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF000000' } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'left' };

      worksheet.getRow(2).height = 14;
      worksheet.mergeCells('B2:H2');
      const addrCell = worksheet.getCell('B2');
      addrCell.value = 'Jl. Syech Quro No. 1, Desa Talagamulya, Kec. Telagasari, Karawang';
      addrCell.font = { name: 'Arial', size: 9, color: { argb: 'FF000000' } };
      addrCell.alignment = { vertical: 'middle', horizontal: 'left' };

      worksheet.getRow(3).height = 14;
      worksheet.mergeCells('B3:H3');
      const telpCell = worksheet.getCell('B3');
      telpCell.value = 'Telp: 0267 48633003 | Email: rseetahamkarawang@gmail.com';
      telpCell.font = { name: 'Arial', size: 9, color: { argb: 'FF000000' } };
      telpCell.alignment = { vertical: 'middle', horizontal: 'left' };

      const sepRow = worksheet.getRow(4);
      sepRow.height = 6;
      worksheet.mergeCells('A4:H4');
      const sepCell = worksheet.getCell('A4');
      sepCell.border = { bottom: { style: 'thick', color: { argb: 'FF000000' } } };

      worksheet.addRow([]);

      worksheet.getRow(6).height = 18;
      worksheet.mergeCells('A6:H6');
      const docTitle = worksheet.getCell('A6');
      docTitle.value = 'DIREKTORI DATA PEGAWAI';
      docTitle.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF000000' } };
      docTitle.alignment = { vertical: 'middle', horizontal: 'center' };

      const dateNow = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      worksheet.getRow(7).height = 14;
      worksheet.mergeCells('A7:H7');
      const docDate = worksheet.getCell('A7');
      docDate.value = `Tanggal Cetak: ${dateNow} WIB`;
      docDate.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF000000' } };
      docDate.alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.addRow([]);

      // 3. Define Table Columns
      worksheet.getRow(9).values = [
        'No', 'ID Pegawai', 'Nama Lengkap', 'Email', 'No. Handphone', 'Departemen', 'Jabatan', 'Tanggal Bergabung'
      ];
      
      // Adjusted widths so it fits perfectly on A4 Landscape without wrapText issues
      worksheet.columns = [
        { key: 'no', width: 8 },
        { key: 'idPegawai', width: 16 },
        { key: 'nama', width: 22 },
        { key: 'email', width: 28 },
        { key: 'noHp', width: 14 },
        { key: 'departemen', width: 16 },
        { key: 'jabatan', width: 16 },
        { key: 'tglGabung', width: 16 },
      ];

      const headerRow = worksheet.getRow(9);
      headerRow.height = 22;
      headerRow.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false }; // Disable wrapText on header
      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } }; // Teal-700
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
      });

      // 4. Add Data Rows
      employees.forEach((emp: any, index: number) => {
        const row = worksheet.addRow({
          no: index + 1,
          idPegawai: emp.userId || emp.id_pegawai || emp.id,
          nama: emp.name,
          email: emp.email,
          noHp: emp.phoneNumber || "-",
          departemen: emp.department?.name || "-",
          jabatan: emp.position?.name || "-",
          tglGabung: new Date(emp.joinDate).toLocaleDateString('id-ID')
        });

        // Set row height explicitly to prevent stretching
        row.height = 18;
        row.font = { name: 'Arial', size: 9 };
        // Disable wrapText to prevent rows from expanding vertically and causing "renggang"
        row.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false };
        
        row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
        row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
        row.getCell(8).alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };

        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };
        });
      });

      // 5. Signature Section
      worksheet.addRow([]);
      worksheet.addRow([]);
      
      const sigRow1 = worksheet.addRow([]);
      const sigRow2 = worksheet.addRow([]);
      const sigRow3 = worksheet.addRow([]);
      const sigRow4 = worksheet.addRow([]);
      const sigRow5 = worksheet.addRow([]);
      
      const dateOnly = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      
      worksheet.mergeCells(`G${sigRow1.number}:H${sigRow1.number}`);
      const sigDateCell = worksheet.getCell(`G${sigRow1.number}`);
      sigDateCell.value = `Karawang, ${dateOnly}`;
      sigDateCell.font = { name: 'Arial', size: 9, color: { argb: 'FF000000' } };
      sigDateCell.alignment = { horizontal: 'center' };

      worksheet.mergeCells(`G${sigRow2.number}:H${sigRow2.number}`);
      const sigTitleCell = worksheet.getCell(`G${sigRow2.number}`);
      sigTitleCell.value = 'Mengetahui,';
      sigTitleCell.font = { name: 'Arial', size: 9, color: { argb: 'FF000000' } };
      sigTitleCell.alignment = { horizontal: 'center' };

      worksheet.mergeCells(`G${sigRow5.number}:H${sigRow5.number}`);
      const sigNameCell = worksheet.getCell(`G${sigRow5.number}`);
      sigNameCell.value = 'Kepala SDM / HRD';
      sigNameCell.font = { name: 'Arial', size: 9, bold: true, underline: true, color: { argb: 'FF000000' } };
      sigNameCell.alignment = { horizontal: 'center' };

      // 6. Generate and Save File
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const filename = `Data_Pegawai_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.xlsx`;
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export Excel:", err);
      alert("Terjadi kesalahan saat mengekspor Excel.");
    }
  }
};
