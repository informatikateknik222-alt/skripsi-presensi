"use client";

import { FileText, Plus, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { usePayroll } from "@/modules/payroll/hooks/usePayroll";
import { PayrollStats } from "@/modules/payroll/components/PayrollStats";
import { PayrollTable } from "@/modules/payroll/components/PayrollTable";
import { PayrollModal } from "@/modules/payroll/components/PayrollModal";
import { payrollService } from "@/modules/payroll/services/payrollService";
import { PayrollRecord } from "@/modules/payroll/types/payroll.types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";

export default function PayrollPage() {
  const { 
    records, 
    employees, 
    isLoading, 
    errorMsg, 
    stats, 
    refresh, 
    setErrorMsg 
  } = usePayroll();
  
  const [userRole, setUserRole] = useState("EMPLOYEE");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [idPegawai, setIdPegawai] = useState("");
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [isFetchingEmployee, setIsFetchingEmployee] = useState(false);

  const [formData, setFormData] = useState({
    period: new Date().toISOString().slice(0, 7),
    basicSalary: 0,
    totalAllowance: 0,
    totalDeduction: 0,
    bpjsDeduction: 0,
    taxDeduction: 0,
    status: "DRAFT"
  });

  useEffect(() => {
    const saved = localStorage.getItem("user_info");
    if (saved) {
      try {
        const info = JSON.parse(saved);
        if (info.role) setUserRole(info.role);
      } catch (e) {}
    }
  }, []);

  const calculateHospitalStandardSalary = (positionName: string, attendanceCount: number = 22, lateCount: number = 0) => {
    const pos = (positionName || "").toLowerCase();

    let basicSalary = 3500000; // UMR base umum
    let tunjanganProfesi = 0;
    let tunjanganRisiko = 0;
    let tunjanganShift = 0;
    let tunjanganKehadiran = attendanceCount * 25000; // Uang transport/makan per kehadiran
    let tunjanganJabatan = 0;

    if (pos.includes("perawat") || pos.includes("nurse")) {
      basicSalary = 4000000;
      tunjanganProfesi = 750000; // STR/Profesi
      tunjanganRisiko = 300000;  // Risiko infeksi medis
      tunjanganShift = 400000;   // Shift rotasi
    } else if (pos.includes("bidan")) {
      basicSalary = 4000000;
      tunjanganProfesi = 750000;
      tunjanganRisiko = 250000;
      tunjanganShift = 400000;
    } else if (pos.includes("farmasi") || pos.includes("apoteker")) {
      basicSalary = 4200000;
      tunjanganProfesi = 800000;
      tunjanganShift = 300000;
    } else if (pos.includes("laboratorium") || pos.includes("analis") || pos.includes("radiologi")) {
      basicSalary = 4100000;
      tunjanganProfesi = 700000;
      tunjanganRisiko = 500000; // Risiko radiasi/spesimen
      tunjanganShift = 300000;
    } else if (pos.includes("admin") || pos.includes("pendaftaran") || pos.includes("kasir") || pos.includes("rekam medis")) {
      basicSalary = 3500000;
      tunjanganJabatan = 300000;
      tunjanganShift = pos.includes("pendaftaran") || pos.includes("kasir") ? 250000 : 0;
    } else if (pos.includes("cleaning") || pos.includes("cs") || pos.includes("security") || pos.includes("satpam") || pos.includes("driver") || pos.includes("supir")) {
      basicSalary = 3000000;
      tunjanganShift = 300000;
      tunjanganRisiko = pos.includes("cleaning") ? 150000 : 0;
    } else {
      // Staff Manajemen, HRD, IT, Keuangan
      basicSalary = 4500000;
      tunjanganJabatan = 1000000;
    }

    const totalAllowance = tunjanganProfesi + tunjanganRisiko + tunjanganShift + tunjanganKehadiran + tunjanganJabatan;
    const totalDeduction = lateCount * 25000; // Potongan terlambat
    const bpjsDeduction = basicSalary * 0.04; // 4% JHT+JP+Kes karyawan
    const taxDeduction = basicSalary * 0.05; // Estimasi PPh21 5%

    return {
      basicSalary,
      totalAllowance,
      totalDeduction,
      bpjsDeduction,
      taxDeduction,
      netSalary: basicSalary + totalAllowance - totalDeduction - bpjsDeduction - taxDeduction
    };
  };

  const handleFetchEmployee = async (id: string) => {
    if (!id) {
      setEmployeeData(null);
      return;
    }
    setIsFetchingEmployee(true);
    const data = await payrollService.getEmployeeById(id);
    setEmployeeData(data);
    
    // Auto calculate if new record
    if (data && !isEditMode) {
      try {
        const attData = await payrollService.getAttendance().catch(() => []);
        const [yearStr, monthStr] = formData.period.split("-");
        const targetYear = parseInt(yearStr);
        const targetMonth = parseInt(monthStr) - 1;

        const userAtt = Array.isArray(attData) ? attData.filter((a: any) => {
          const d = new Date(a.date);
          return (a.userId === data.id || a.user?.id === data.id || a.userId === data.userId || a.userId === id) &&
                 d.getMonth() === targetMonth && d.getFullYear() === targetYear;
        }) : [];

        const totalHadir = userAtt.filter((a: any) => a.status === 'PRESENT' || a.status === 'LATE').length;
        const totalTelat = userAtt.filter((a: any) => a.status === 'LATE').length;

        const positionName = data.position?.name || "";
        const standardSalary = calculateHospitalStandardSalary(positionName, totalHadir, totalTelat);
        
        setFormData(prev => ({
          ...prev,
          basicSalary: standardSalary.basicSalary,
          totalAllowance: standardSalary.totalAllowance,
          totalDeduction: standardSalary.totalDeduction,
          bpjsDeduction: standardSalary.bpjsDeduction,
          taxDeduction: standardSalary.taxDeduction
        }));
      } catch (err) {
        console.error("Failed to calculate attendance linked salary", err);
      }
    }
    
    setIsFetchingEmployee(false);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingId("");
    setIdPegawai("");
    setEmployeeData(null);
    setFormData({
      period: new Date().toISOString().slice(0, 7),
      basicSalary: 0,
      totalAllowance: 0,
      totalDeduction: 0,
      bpjsDeduction: 0,
      taxDeduction: 0,
      status: "DRAFT"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record: PayrollRecord) => {
    setIsEditMode(true);
    setEditingId(record.id);
    setIdPegawai(record.userId);
    setEmployeeData({ name: "Data Tersimpan", userId: record.userId });
    
    const dateObj = new Date(record.period);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    
    setFormData({
      period: `${year}-${month}`,
      basicSalary: Number(record.basicSalary) || 0,
      totalAllowance: Number(record.totalAllowance) || 0,
      totalDeduction: Number(record.totalDeduction) || 0,
      bpjsDeduction: Number(record.bpjsDeduction) || 0,
      taxDeduction: Number(record.taxDeduction) || 0,
      status: record.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeData && !isEditMode) {
      alert("Pegawai tidak ditemukan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const netSalary = Number(formData.basicSalary) + Number(formData.totalAllowance) - Number(formData.totalDeduction) - Number(formData.bpjsDeduction) - Number(formData.taxDeduction);

      const payload = {
        userId: isEditMode ? idPegawai : employeeData.userId,
        period: new Date(formData.period + "-01").toISOString(),
        basicSalary: Number(formData.basicSalary),
        totalAllowance: Number(formData.totalAllowance),
        totalDeduction: Number(formData.totalDeduction),
        bpjsDeduction: Number(formData.bpjsDeduction),
        taxDeduction: Number(formData.taxDeduction),
        netSalary,
        status: formData.status
      };

      if (isEditMode) {
        await payrollService.updateRecord(editingId, payload);
      } else {
        await payrollService.createRecord(payload);
      }

      await refresh();
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus catatan ini?")) return;
    try {
      await payrollService.deleteRecord(id);
      await refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleAutoGenerate = async () => {
    if (!window.confirm("Proses Auto-Generate slip gaji standar RS untuk bulan ini?")) return;
    
    setIsSubmitting(true);
    try {
      const [empData, attData] = await Promise.all([
        payrollService.getEmployees(),
        payrollService.getAttendance()
      ]);
      
      const currMonth = new Date().getMonth();
      const currYear = new Date().getFullYear();
      const periodStr = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-01T00:00:00.000Z`;

      const thisMonthAtt = Array.isArray(attData) ? attData.filter(a => {
        const d = new Date(a.date);
        return d.getMonth() === currMonth && d.getFullYear() === currYear;
      }) : [];

      if (!Array.isArray(empData)) {
        throw new Error("Gagal mengambil daftar pegawai. Data tidak valid.");
      }

      let generatedCount = 0;

      for (const emp of empData) {
        const positionName = emp.position?.name || "";
        const userAtt = thisMonthAtt.filter(a => a.userId === emp.id || a.user?.id === emp.id);
        const totalHadir = userAtt.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
        const totalTelat = userAtt.filter(a => a.status === 'LATE').length;

        const standardSalary = calculateHospitalStandardSalary(positionName, totalHadir, totalTelat);

        await payrollService.createRecord({
          userId: emp.userId || emp.id,
          period: periodStr,
          basicSalary: standardSalary.basicSalary,
          totalAllowance: standardSalary.totalAllowance,
          totalDeduction: standardSalary.totalDeduction,
          bpjsDeduction: standardSalary.bpjsDeduction,
          taxDeduction: standardSalary.taxDeduction,
          netSalary: standardSalary.netSalary,
          status: "DRAFT"
        });
        generatedCount++;
      }
      
      alert(`Berhasil generate ${generatedCount} slip gaji pegawai.`);
      await refresh();
    } catch (e: any) {
      alert("Gagal: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportExcel = async () => {
    if (!records || records.length === 0) {
      alert("Tidak ada data penggajian untuk diekspor!");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Rekap Penggajian', {
        views: [{ showGridLines: false }], // Hide default gridlines for cleaner look
        pageSetup: {
          paperSize: 9, // 9 = A4 paper
          orientation: 'landscape',
          fitToPage: true,
          fitToWidth: 1,
          fitToHeight: 0,
          margins: {
            left: 0.2,
            right: 0.2,
            top: 0.4,
            bottom: 0.4,
            header: 0.2,
            footer: 0.2
          }
        }
      });

      // 1. Setup Image (Logo)
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
            tl: { col: 0.1, row: 0.1 },
            ext: { width: 60, height: 60 }
          });
        }
      } catch (e) {
        console.warn("Could not load logo for Excel", e);
      }

      // 2. Hospital Header
      worksheet.getRow(1).height = 22;
      worksheet.mergeCells('A1:M1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'RUMAH SAKIT EFARINA ETAHAM KARAWANG';
      titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF000000' } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.getRow(2).height = 14;
      worksheet.mergeCells('A2:M2');
      const addrCell = worksheet.getCell('A2');
      addrCell.value = 'Jl. Syech Quro No. 1, Desa Talagamulya, Kec. Telagasari, Karawang';
      addrCell.font = { name: 'Arial', size: 9, color: { argb: 'FF000000' } };
      addrCell.alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.getRow(3).height = 14;
      worksheet.mergeCells('A3:M3');
      const telpCell = worksheet.getCell('A3');
      telpCell.value = 'Telp: (0267) 8486555 | Email: rsefarinaetaham@gmail.com';
      telpCell.font = { name: 'Arial', size: 9, color: { argb: 'FF000000' } };
      telpCell.alignment = { vertical: 'middle', horizontal: 'center' };

      // Separator line at row 4
      const sepRow = worksheet.getRow(4);
      sepRow.height = 6;
      worksheet.mergeCells('A4:M4');
      const sepCell = worksheet.getCell('A4');
      sepCell.border = { bottom: { style: 'thick', color: { argb: 'FF000000' } } };

      worksheet.addRow([]); // Row 5 empty

      worksheet.getRow(6).height = 18;
      worksheet.mergeCells('A6:M6');
      const docTitle = worksheet.getCell('A6');
      docTitle.value = 'LAPORAN PEMBUKUAN PENGGAJIAN PEGAWAI';
      docTitle.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF000000' } };
      docTitle.alignment = { vertical: 'middle', horizontal: 'center' };

      const dateNow = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      worksheet.getRow(7).height = 14;
      worksheet.mergeCells('A7:M7');
      const docDate = worksheet.getCell('A7');
      docDate.value = `Tanggal Cetak: ${dateNow} WIB`;
      docDate.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF000000' } };
      docDate.alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.addRow([]); // Row 8 empty

      // 3. Define Table Columns (starts at Row 9)
      worksheet.getRow(9).values = [
        'No', 'ID Pegawai', 'Nama Pegawai', 'Departemen', 'Jabatan', 'Periode', 
        'Gaji Pokok', 'Tunjangan', 'Pot Lain', 'BPJS', 'PPh 21', 'Penerimaan Bersih', 'Status'
      ];
      worksheet.columns = [
        { key: 'no', width: 4 },
        { key: 'idPegawai', width: 12 },
        { key: 'namaPegawai', width: 18 },
        { key: 'departemen', width: 14 },
        { key: 'jabatan', width: 14 },
        { key: 'periode', width: 12 },
        { key: 'gajiPokok', width: 12 },
        { key: 'tunjangan', width: 11 },
        { key: 'potonganLain', width: 11 },
        { key: 'bpjs', width: 11 },
        { key: 'pajak', width: 11 },
        { key: 'bersih', width: 13 },
        { key: 'status', width: 9 },
      ];

      // Style the header row (Row 9)
      const headerRow = worksheet.getRow(9);
      headerRow.height = 25;
      headerRow.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0F766E' } 
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
      });

      // 4. Add Data Rows
      let totalGajiPokok = 0;
      let totalTunjangan = 0;
      let totalPotonganLain = 0;
      let totalBpjs = 0;
      let totalPajak = 0;
      let totalBersih = 0;

      records.forEach((record: any, index: number) => {
        const emp = employees.find(e => e.id === record.userId || e.userId === record.userId) || {};
        const dateObj = new Date(record.period);
        
        const row = worksheet.addRow({
          no: index + 1,
          idPegawai: emp.id_pegawai || record.userId,
          namaPegawai: emp.name || record.userId,
          departemen: emp.department?.name || "-",
          jabatan: emp.position?.name || "-",
          periode: dateObj.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
          gajiPokok: Number(record.basicSalary) || 0,
          tunjangan: Number(record.totalAllowance) || 0,
          potonganLain: Number(record.totalDeduction) || 0,
          bpjs: Number(record.bpjsDeduction) || 0,
          pajak: Number(record.taxDeduction) || 0,
          bersih: Number(record.netSalary) || 0,
          status: record.status === 'PAID' ? 'LUNAS' : record.status === 'PENDING' ? 'TUNDA' : 'DRAFT'
        });

        totalGajiPokok += Number(record.basicSalary) || 0;
        totalTunjangan += Number(record.totalAllowance) || 0;
        totalPotonganLain += Number(record.totalDeduction) || 0;
        totalBpjs += Number(record.bpjsDeduction) || 0;
        totalPajak += Number(record.taxDeduction) || 0;
        totalBersih += Number(record.netSalary) || 0;

        row.font = { name: 'Arial', size: 8 };
        row.alignment = { vertical: 'middle', wrapText: true };
        
        // Alignment for specific columns
        row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
        row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
        row.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
        row.getCell(13).alignment = { vertical: 'middle', horizontal: 'center' };

        // Number formatting for currency columns (Accounting format Rp)
        [7, 8, 9, 10, 11, 12].forEach(colIndex => {
          const cell = row.getCell(colIndex);
          cell.numFmt = '_("Rp"* #,##0_);_("Rp"* (#,##0);_("Rp"* "-"_);_(@_)';
        });

        // Add borders to the row
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };
        });
      });

      // 5. Add Total Row
      const totalRow = worksheet.addRow({
        no: '',
        idPegawai: '',
        namaPegawai: 'TOTAL KESELURUHAN',
        departemen: '',
        jabatan: '',
        periode: '',
        gajiPokok: totalGajiPokok,
        tunjangan: totalTunjangan,
        potonganLain: totalPotonganLain,
        bpjs: totalBpjs,
        pajak: totalPajak,
        bersih: totalBersih,
        status: ''
      });

      worksheet.mergeCells(`A${totalRow.number}:F${totalRow.number}`);
      
      totalRow.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF000000' } };
      totalRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'right' };
      
      [7, 8, 9, 10, 11, 12].forEach(colIndex => {
        const cell = totalRow.getCell(colIndex);
        cell.numFmt = '_("Rp"* #,##0_);_("Rp"* (#,##0);_("Rp"* "-"_);_(@_)';
      });

      totalRow.eachCell((cell, colNumber) => {
        if (colNumber <= 13) {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE2E8F0' } 
          };
        }
      });
      
      // 6. Signature Section
      worksheet.addRow([]);
      worksheet.addRow([]);
      
      const sigRow1 = worksheet.addRow([]);
      const sigRow2 = worksheet.addRow([]);
      const sigRow3 = worksheet.addRow([]);
      const sigRow4 = worksheet.addRow([]);
      const sigRow5 = worksheet.addRow([]);
      
      const dateOnly = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      
      worksheet.mergeCells(`K${sigRow1.number}:M${sigRow1.number}`);
      const sigDateCell = worksheet.getCell(`K${sigRow1.number}`);
      sigDateCell.value = `Karawang, ${dateOnly}`;
      sigDateCell.font = { name: 'Arial', size: 9, color: { argb: 'FF000000' } };
      sigDateCell.alignment = { horizontal: 'center' };

      worksheet.mergeCells(`K${sigRow2.number}:M${sigRow2.number}`);
      const sigTitleCell = worksheet.getCell(`K${sigRow2.number}`);
      sigTitleCell.value = 'Mengetahui,';
      sigTitleCell.font = { name: 'Arial', size: 9, color: { argb: 'FF000000' } };
      sigTitleCell.alignment = { horizontal: 'center' };

      worksheet.mergeCells(`K${sigRow3.number}:M${sigRow4.number}`); 

      worksheet.mergeCells(`K${sigRow5.number}:M${sigRow5.number}`);
      const sigNameCell = worksheet.getCell(`K${sigRow5.number}`);
      sigNameCell.value = 'Direktur / Kepala Keuangan';
      sigNameCell.font = { name: 'Arial', size: 9, bold: true, underline: true, color: { argb: 'FF000000' } };
      sigNameCell.alignment = { horizontal: 'center' };

      // 7. Generate and Save File
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const filename = `Laporan_Penggajian_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.xlsx`;
      
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
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount).replace(/\u00A0/g, ' ');
  };

  const handlePrintSlip = (record: any, action: 'download' | 'print' = 'print') => {
    const emp = employees.find(e => e.id === record.userId || e.userId === record.userId) || {};
    const displayId = emp.id_pegawai || record.userId;
    const displayName = emp.name || record.userId;
    const deptName = emp.department?.name || "-";
    const posName = emp.position?.name || "-";

    const doc = new jsPDF();
    const logoUrl = "/logo.png";
    const img = new window.Image();
    img.src = logoUrl;
    
    const dateObj = new Date(record.period);
    const periodStr = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const dateNow = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    const drawContent = (doc: jsPDF, startY: number) => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("SLIP GAJI PEGAWAI", 105, startY, { align: "center" });
      
      startY += 10;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      const startX = 14;
      const colonX = 40;
      const valueX = 43;

      doc.text("ID Pegawai", startX, startY);
      doc.text(":", colonX, startY);
      doc.text(displayId, valueX, startY);

      doc.text("Nama", startX, startY + 6);
      doc.text(":", colonX, startY + 6);
      doc.text(displayName, valueX, startY + 6);

      doc.text("Departemen", startX, startY + 12);
      doc.text(":", colonX, startY + 12);
      doc.text(`${deptName} / ${posName}`, valueX, startY + 12);

      doc.text("Periode", startX, startY + 18);
      doc.text(":", colonX, startY + 18);
      doc.text(periodStr, valueX, startY + 18);
      
      startY += 26;

      const tableData = [
        ['Gaji Pokok', formatCurrency(Number(record.basicSalary || 0))],
        ['Tunjangan', formatCurrency(Number(record.totalAllowance || 0))],
        ['Potongan Keterlambatan/Lainnya', formatCurrency(Number(record.totalDeduction || 0))],
        ['Potongan BPJS (3%)', formatCurrency(Number(record.bpjsDeduction || 0))],
        ['Potongan PPh 21 (5%)', formatCurrency(Number(record.taxDeduction || 0))],
      ];

      autoTable(doc, {
        startY,
        head: [['Keterangan', 'Jumlah']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: 'bold' },
        bodyStyles: { textColor: [51, 65, 85] },
        foot: [['PENERIMAAN BERSIH', formatCurrency(Number(record.netSalary || 0))]],
        footStyles: { fillColor: [226, 232, 240], textColor: [15, 23, 42], fontStyle: 'bold' }
      });

      const finalY = (doc as any).lastAutoTable.finalY + 30;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Penerima,", 50, finalY, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.text(`(${displayName})`, 50, finalY + 25, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.text("Karawang, " + dateNow, 160, finalY - 5, { align: "center" });
      doc.text("Dibuat Oleh,", 160, finalY, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.text("Keuangan RS Efarina Etaham", 160, finalY + 25, { align: "center" });

      if (action === 'print') {
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
      } else {
        doc.save(`Slip_Gaji_${displayId}_${periodStr}.pdf`);
      }
    };

    img.onload = () => {
      doc.addImage(img, 'PNG', 14, 12, 20, 20); 
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("RUMAH SAKIT EFARINA ETAHAM KARAWANG", 105, 18, { align: "center" });
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Jl. Syech Quro No. 1, Desa Talagamulya, Kec. Telagasari, Karawang", 105, 23, { align: "center" });
      doc.line(14, 34, 196, 34); 
      drawContent(doc, 45);
    };

    img.onerror = () => {
      doc.text("RUMAH SAKIT EFARINA ETAHAM KARAWANG", 105, 20, { align: "center" });
      doc.line(14, 26, 196, 26);
      drawContent(doc, 35);
    };
  };

  return (
    <div className="space-y-6 relative transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Penggajian</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Ringkasan dan riwayat pembayaran gaji pegawai.</p>
        </div>
        
        {(userRole === "ADMIN" || userRole === "KEUANGAN") && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleAutoGenerate}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg active:scale-95"
            >
              <FileText size={18} />
              Auto-Generate
            </button>
            <button 
              onClick={handleExportExcel}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg active:scale-95"
            >
              <Download size={18} />
              Export Excel
            </button>
            <button 
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg active:scale-95"
            >
              <Plus size={18} />
              Buat Manual
            </button>
          </div>
        )}
      </div>
      
      <PayrollStats stats={stats} />

      <PayrollTable 
        records={records}
        employees={employees}
        isLoading={isLoading}
        errorMsg={errorMsg}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterPeriod={filterPeriod}
        setFilterPeriod={setFilterPeriod}
        userRole={userRole}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onPrint={handlePrintSlip}
      />

      <PayrollModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        idPegawai={idPegawai}
        setIdPegawai={setIdPegawai}
        employeeData={employeeData}
        isFetchingEmployee={isFetchingEmployee}
        onFetchEmployee={handleFetchEmployee}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
