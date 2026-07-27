# 🏥 Clinic Management System (Sistem Manajemen Klinik)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-emerald?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

Sistem Manajemen Klinik & Rekam Medis Elektronik (EMR) berbasis web modern yang responsif, cepat, dan terintegrasi untuk pengelolaan operasional klinik secara efisien.

---

## ✨ Fitur Utama

- **📊 Dashboard Operational Real-Time**
  - Ringkasan status antrean hari ini (Menunggu, Pemeriksaan, Kasir, Selesai).
  - Indikator pendapatan harian & statistik pasien.
  - Peringatan stok obat menipis (Low stock alert).

- **🎫 Manajemen Antrean (Queue Management)**
  - Pendaftaran antrean pasien baru atau terdaftar.
  - Pemanggilan & pembaruan status antrean secara real-time.
  - Alur antrean dari Pendaftaran → Dokter → Kasir.

- **🩺 Rekam Medis Elektronik (EMR)**
  - Penginputan riwayat medis pasien oleh Dokter.
  - Pencatatan keluhan, anamnesis, diagnosis, tindakan medis, serta resep obat.

- **💳 Kasir & Pembayaran (Billing & Cashier)**
  - Kalkulasi otomatis total biaya konsultasi, tindakan medis, dan resep obat.
  - Penerbitan kuitansi & invoice pembayaran.

- **📈 Laporan & Analisis Data**
  - Laporan pendapatan bulanan & harian.
  - Laporan kunjungan pasien & rekapitulasi obat.

- **🗂️ Master Data Management**
  - Pengelolaan Data Pasien, Dokter, Stok Obat & Alkes, serta Tarif Layanan Klinik.

---

## 🛠️ Stack Teknologi

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth**: [Supabase PostgreSQL](https://supabase.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Panduan Memulai (Getting Started)

### Prasyarat
- [Node.js](https://nodejs.org/) v18+ atau versi lebih baru
- Akun [Supabase](https://supabase.com/)

### 1. Clone Repository
```bash
git clone https://github.com/iarisaldy/clinic-management-system.git
cd clinic-management-system
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env.local` pada root project dan sesuaikan konfigurasi kredensial Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

---

## 📄 Lisensi

Proyek ini menggunakan lisensi MIT.
