# Sistem Presensi dan Penggajian (HR Dashboard)

Aplikasi ini adalah sistem informasi untuk manajemen **Presensi, Penggajian, dan Cuti Karyawan** dengan arsitektur **NestJS Monorepo**. Sistem ini dirancang untuk Rumah Sakit Efarina Etaham Karawang.

## 🛠️ Teknologi yang Digunakan

*   **Frontend**: Next.js 15, React, Tailwind CSS
*   **Backend**: NestJS Monorepo (TypeScript)
    *   **Employee Service** (Port 4001): Data Pegawai, Departemen, Jabatan.
    *   **Attendance Service** (Port 4002): Absensi & Cuti.
    *   **Payroll Service** (Port 4003): Penggajian.
*   **Database**: PostgreSQL (Per-Schema Management)
*   **ORM**: Prisma ORM

---

## 📋 Persyaratan Sistem

1.  **Node.js** (v18+) & **Yarn**
2.  **Docker Desktop** (Untuk PostgreSQL)

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Persiapan Database
Pastikan Docker berjalan, lalu jalankan:
```bash
docker-compose up -d
```

### 2. Install Dependensi
```bash
# Install root & backend
yarn install
cd backend && yarn install && cd ..

# Install frontend
cd frontend && yarn install && cd ..
```

### 3. Sinkronisasi Database (Prisma)
Jalankan perintah ini di dalam folder `backend`:
```bash
cd backend
npx prisma db push --schema=apps/employee/prisma/schema.prisma
npx prisma db push --schema=apps/attendance/prisma/schema.prisma
npx prisma db push --schema=apps/payroll/prisma/schema.prisma
```

### 4. Jalankan Aplikasi
Dari root directory, jalankan:
```bash
yarn dev
```

---

## 🏗️ Struktur Folder Baru
- `/backend`: NestJS Monorepo berisi semua service.
- `/frontend`: Aplikasi web Next.js.
- `/db-init`: Script inisialisasi database.

---
*Dibuat untuk keperluan Skripsi / Tugas Akhir - 2026.*
