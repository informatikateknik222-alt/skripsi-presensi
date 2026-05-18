-- Menggunakan 1 database utama (presensi) yang sudah diset di docker-compose.yml
-- Membuat schema untuk masing-masing service di dalam presensi

CREATE SCHEMA IF NOT EXISTS employee;
CREATE SCHEMA IF NOT EXISTS attendance;
CREATE SCHEMA IF NOT EXISTS payroll;

