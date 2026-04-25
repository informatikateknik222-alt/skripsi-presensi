# Sistem Presensi dan Penggajian (HR Dashboard)

Aplikasi ini adalah sistem informasi untuk manajemen **Presensi, Penggajian, dan Cuti Karyawan** dengan arsitektur microservices menggunakan Node.js, NestJS, Next.js, dan PostgreSQL. Sistem ini dirancang untuk Rumah Sakit Efarina Etaham Karawang.

## 🛠️ Teknologi yang Digunakan

*   **Frontend**: Next.js 15, React, Tailwind CSS, Lucide Icons
*   **Backend (Microservices)**: NestJS (TypeScript)
    *   API Gateway
    *   Auth Service
    *   Attendance Service (Integrasi Fingerspot)
    *   Employee Service
    *   Payroll Service
*   **Database**: PostgreSQL (menggunakan Prisma ORM)
*   **Deployment & Containerization**: Docker

---

## 📋 Persyaratan Sistem (Prerequisites)

Sebelum menjalankan aplikasi, pastikan komputer Anda sudah terinstal:

1.  **Node.js** (Minimal versi 18.x) - [Download di sini](https://nodejs.org/)
2.  **Yarn** - *Package manager utama yang digunakan di proyek ini*
    ```bash
    npm install --global yarn
    ```
3.  **Docker Desktop** - Untuk menjalankan database PostgreSQL - [Download di sini](https://www.docker.com/products/docker-desktop/)
4.  **Git** - [Download di sini](https://git-scm.com/)

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini menggunakan sistem *Monorepo script* untuk menjalankan seluruh layanan (5 service backend + 1 frontend) secara bersamaan hanya dengan 1 perintah.

### 1. Kloning Repository
```bash
git clone https://github.com/informatikateknik222-alt/skripsi-presensi.git
cd skripsi-presensi
```

### 2. Jalankan Database (Docker)
Pastikan Docker Desktop sudah berjalan, lalu buka terminal di root folder (`skripsi-presensi`) dan jalankan:
```bash
docker-compose up -d
```
*Perintah ini akan mendownload image PostgreSQL dan membuat container database beserta inisialisasi awal.*

### 3. Install Dependensi
Karena ini arsitektur microservice, Anda perlu menginstal dependencies untuk root, frontend, dan masing-masing backend. Anda bisa melakukan `yarn install` pada setiap folder:

```bash
# Install root
yarn install

# Install Frontend
cd frontend
yarn install
cd ..

# Install API Gateway
cd backend/api-gateway
yarn install
cd ../..

# Install layanan lainnya (Lakukan hal yang sama untuk auth, attendance, employee, dan payroll)
cd backend/auth-service && yarn install && cd ../..
cd backend/employee-service && yarn install && cd ../..
cd backend/attendance-service && yarn install && cd ../..
cd backend/payroll-service && yarn install && cd ../..
```

### 4. Sinkronisasi Database (Prisma Migrations)
Jalankan migrasi database di setiap service backend untuk membentuk struktur tabel di PostgreSQL:

```bash
cd backend/auth-service && npx prisma db push && cd ../..
cd backend/employee-service && npx prisma db push && cd ../..
cd backend/attendance-service && npx prisma db push && cd ../..
cd backend/payroll-service && npx prisma db push && cd ../..
```

*(Opsional: Anda bisa menjalankan skrip seeding `npx prisma db seed` jika ada pada auth-service atau employee-service untuk data awal admin).*

### 5. Jalankan Aplikasi (Semua Service)
Kembali ke **root directory** (`skripsi-presensi`), lalu jalankan perintah:
```bash
yarn dev
```
Perintah ini akan mengeksekusi `concurrently` yang langsung menjalankan **Frontend** dan seluruh **Backend Services** secara bersamaan. 

Tunggu beberapa saat sampai terminal tidak lagi memunculkan teks error/build.
*   **Akses Frontend (Dashboard)**: `http://localhost:3000`
*   **Akses API Gateway**: `http://localhost:4000`

---

## 🔑 Hak Akses (Roles)
Sistem ini membedakan fitur berdasarkan role pengguna:
1.  **ADMIN / HRD**: Dapat mengelola semua fitur (CRUD pegawai, persetujuan cuti, rekap presensi, buat slip gaji).
2.  **KEUANGAN**: Berhak melakukan auto-generate payroll dan mencetak slip gaji.
3.  **EMPLOYEE (Pegawai)**: Hanya dapat melihat rekap riwayat presensi sendiri, mengajukan cuti mandiri, dan melihat slip gaji mereka sendiri.

## 📝 Fitur Utama Tambahan Terakhir
*   **Direct Print to PDF**: Fitur cetak langsung tanpa download file di menu Presensi, Penggajian, dan Cuti (Menggunakan `jsPDF`).

---
*Dibuat untuk keperluan Skripsi / Tugas Akhir - 2026.*
