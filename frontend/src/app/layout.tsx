import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistem HR - RS Efarina",
  description: "Portal Manajemen Karyawan, Presensi, dan Penggajian Terpadu Rumah Sakit Efarina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" translate="no" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen bg-[#0f172a]`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
