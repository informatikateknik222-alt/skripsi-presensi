# Dokumentasi Diagram Sistem Presensi & Penggajian

Dokumen ini berisi Use Case Diagram dan Flowchart sistem yang telah disesuaikan dengan struktur baru (3 Port: 4001, 4002, 4003).

## 1. Use Case Diagram

Diagram ini menunjukkan interaksi antara Actor (Karyawan, SDM, Keuangan) dengan sistem.

```mermaid
flowchart LR
    %% Actors
    emp(("Karyawan"))
    sdm(("Admin SDM"))
    keu(("Bagian Keuangan"))

    %% System
    subgraph Sistem["Sistem Presensi & Penggajian (Port 4001-4003)"]
        direction TB
        UC1(["Login (Dummy)"])
        UC2(["Presensi Masuk/Pulang"])
        UC3(["Melihat Rekap Presensi"])
        UC4(["Mengelola Data Karyawan"])
        UC5(["Mengelola Jabatan & Dept"])
        UC6(["Pengajuan Cuti"])
        UC7(["Generate Gaji Bulanan"])
        UC8(["Melihat Slip Gaji"])
    end

    %% Relationships
    emp --> UC1
    emp --> UC2
    emp --> UC3
    emp --> UC6
    emp --> UC8

    sdm --> UC1
    sdm --> UC4
    sdm --> UC5
    sdm --> UC3

    keu --> UC1
    keu --> UC7
    keu --> UC8
```

---

## 2. Flowchart Sistem

Diagram ini menunjukkan alur proses utama dalam sistem.

```mermaid
flowchart TD
    Start((Mulai)) --> Login[Halaman Login]
    Login --> Auth{Cek Login}
    Auth -- Berhasil --> Dash[Dashboard Utama]
    
    Dash --> Menu{Pilih Menu}
    
    Menu -- "Karyawan (4001)" --> EmpMng[Kelola Data Pegawai / Jabatan]
    Menu -- "Presensi (4002)" --> AttMng[Input Absensi / Rekap Harian]
    Menu -- "Penggajian (4003)" --> PayMng[Generate Gaji / Slip Gaji]
    
    EmpMng --> DB[(Database Employee)]
    AttMng --> DB2[(Database Attendance)]
    PayMng --> DB3[(Database Payroll)]
    
    DB --> End((Selesai))
    DB2 --> End
    DB3 --> End
```

---

## 3. Catatan Implementasi Port
*   **Port 4001**: Melayani Use Case terkait Karyawan, Departemen, dan Jabatan.
*   **Port 4002**: Melayani Use Case terkait Presensi dan Cuti.
*   **Port 4003**: Melayani Use Case terkait Payroll dan Slip Gaji.
