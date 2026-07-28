# 🏥 Sistem Informasi Praktik Dokter Mandiri & EMR

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Developer](https://img.shields.io/badge/Developed_by-Muhammad_Irfan-teal?style=flat-square)](https://github.com/iarisaldy)

Sistem Informasi Manajemen Klinik, EMR (Rekam Medis Elektronik), dan Pencetakan Surat Dokter ringkas berbasis web modern yang didesain khusus untuk **Dokter Praktik Mandiri** (Solo Practitioner).

---

## ✨ Fitur Utama Sistem

- **🩺 Solo Practice EMR Suite (Rekam Medis Dokter)**
  - Penginputan riwayat medis pasien ringkas: Tanda Vital (TTV), Anamnesis, Diagnosis ICD-10, serta Resep Obat Dinamis.
  - Alur pelayanan tunggal serbaguna dari pendaftaran s/d pembayaran tanpa batas role yang rumit.

- **📜 Modul Cetak Surat Kesehatan & Rujukan RS (Print-Ready)**
  - **Surat Keterangan Sehat**: Auto-fill dari EMR (TB, BB, Tekanan Darah, Golongan Darah, Buta Warna, Keperluan Surat & Status Sehat).
  - **Surat Rujukan Ke Rumah Sakit**: Penentuan RS Tujuan, Poli Spesialis, Anamnesis Ringkas, Diagnosis Kerja & Alasan Rujukan Medis.
  - **Surat Keterangan Sakit / Istirahat**: Jumlah hari istirahat, tanggal mulai/selesai & diagnosis.
  - **Kop Surat Resmi Dokter Praktik**: Format siap cetak browser (`window.print()`) dengan signature & stamp block.

- **🎫 Antrean Pasien & Pendaftaran Instant**
  - Pendaftaran antrean harian dan pemanggilan pasien.

- **💳 Kasir & Kalkulasi Tagihan Otomatis**
  - Kalkulasi otomatis total biaya konsultasi, obat, dan tindakan medis + pencetakan kuitansi.

- **📦 Kelola Obat & Tarif Layanan**
  - Master data stok obat dengan alert stok menipis (low stock alert) dan penyesuaian tarif dokter.

---

## 🛠️ Stack Teknologi

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **Deployment**: Vercel Ready

---

## 🚀 Panduan Deployment Ke Vercel

### Langkah 1: Push Perubahan ke GitHub
```bash
git add .
git commit -m "feat: Add Solo Practice Doctor workflow & Surat module (by Muhammad Irfan)"
git push origin main
```

### Langkah 2: Deploy di Vercel
1. Buka [https://vercel.com/new](https://vercel.com/new) dan login dengan akun Vercel Anda.
2. Pilih repositori **`clinic-management-system`** dari daftar repositori GitHub Anda.
3. Pada halaman konfigurasi project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
4. Klik **Deploy**. Vercel akan otomatis melakukan kompilasi dan menerbitkan link URL domain website aktif (misal `clinic-management-system.vercel.app`).

---

## 📄 Lisensi & Hak Cipta

Copyright © 2026 **Muhammad Irfan**. All Rights Reserved.  
Sistem ini dirancang & dikembangkan oleh **Muhammad Irfan**.
