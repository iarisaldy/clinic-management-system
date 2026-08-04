# 🏥 Sistem Informasi Praktik Dokter Mandiri, EMR & AI Copilot

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Playwright E2E](https://img.shields.io/badge/Playwright-E2E_Tests-2EAD33?style=flat-square&logo=playwright)](https://playwright.dev/)
[![AI Integrated](https://img.shields.io/badge/AI-MedAssistant_Copilot-7C3AED?style=flat-square&logo=openai)](https://generativelanguage.googleapis.com/)
[![Developer](https://img.shields.io/badge/Developed_by-Muhammad_Irfan-teal?style=flat-square)](https://github.com/iarisaldy)

Sistem Informasi Manajemen Klinik, Rekam Medis Elektronik (EMR), **AI Clinical Assistant**, dan Sistem Cetak Surat Dokter modern yang didesain khusus untuk **Dokter Praktik Mandiri (Solo Practitioner)**. Lengkap dengan **Automated E2E Testing Suite (Playwright)** dan **GitHub Actions CI/CD Pipeline**.

---

## ✨ Fitur Utama Sistem

### 🩺 1. Solo Practice EMR Suite (Rekam Medis Dokter)
- **Penginputan Tanda Vital (TTV)**: Systolic, Diastolic, Suhu (°C), Berat (kg), Tinggi (cm), dan Nadi (bpm).
- **Anamnesis & Diagnosis ICD-10**: Input keluhan terarah, riwayat medis terdahulu (*Past EMR Timeline*), serta pencatatan tindakan medis.
- **Resep Obat Dinamis**: Kalkulasi biaya resep otomatis dengan validasi stok obat real-time.

---

### 🤖 2. MedAssistant AI Copilot & Floating Chatbot (HealthTech AI)
- **✨ AI Suggest ICD-10 di EMR**: Tombol cerdas di ruang periksa dokter yang secara otomatis menganalisis anamnesis pasien dan merekomendasikan kode diagnosis ICD-10 serta saran dosis obat.
- **💬 Floating AI Assistant Chatbot**: Widget AI interaktif (pojok kanan bawah) yang dapat menjawab pertanyaan medis, memberikan rekomendasi resep formularium, dan triase gejala pasien secara real-time.
- **Smart Fallback Engine**: Didukung oleh **Google Gemini API** dengan mekanisme *fallback mock* cerdas sehingga demo tetap berjalan mulus meskipun API key belum diset.

---

### 🧪 3. E2E & API Automated Testing Suite (Playwright)
- **Multi-Browser Test Coverage**: Pengujian E2E otomatis untuk Chromium Desktop dan Mobile Chrome.
- **Workflow Testing**: Menguji seluruh alur klinik mulai dari Pendaftaran Pasien $\rightarrow$ Antrean $\rightarrow$ EMR Dokter $\rightarrow$ Pembayaran Kasir $\rightarrow$ Cetak Surat Medis.
- **GitHub Actions CI Pipeline**: Integrasi CI/CD otomatis di `.github/workflows/e2e.yml` untuk memastikan kualitas kode di setiap push & pull request.

---

### ⚡ 4. 1-Click Demo Data Generator
- **Tombol Reset Demo**: Tombol `⚡ Reset Demo Data` di Navbar untuk memuat sample data klinik (pasien, antrean, EMR, & surat) secara instan dalam 1 detik. Sangat memudahkan recruiter/evaluator saat menguji demo di Vercel.

---

### 📜 5. Modul Cetak Surat Kesehatan & Rujukan RS (Print-Ready)
- **Surat Keterangan Sehat**: Auto-fill dari EMR (TB, BB, Tekanan Darah, Nadi, Golongan Darah, Buta Warna, Keperluan Surat & Status Sehat).
- **Surat Rujukan Ke Rumah Sakit**: Penentuan RS Tujuan, Poli Spesialis, Anamnesis Ringkas, Diagnosis Kerja & Alasan Rujukan Medis.
- **Surat Keterangan Sakit (Istirahat)**: Jumlah hari istirahat, tanggal mulai/selesai & diagnosis.
- **Kop Surat Resmi Dokter**: Format siap cetak browser (`window.print()`) dengan signature & stamp block dinamis.

---

### 💳 6. Kasir, Billing & Kelola Master Data
- **Kalkulasi Tagihan Otomatis**: Rincian biaya konsultasi, tindakan medis, dan total resep obat + pencetakan kuitansi.
- **Master Data Obat & Tarif**: Manajemen stok obat dengan alert stok menipis (*low stock warning*) dan daftar tarif tindakan dokter.

---

## 🛠️ Stack Teknologi

| Komponen | Teknologi / Library |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router & Turbopack) |
| **Bahasa Pemrograman** | TypeScript 5 |
| **Styling & UI** | Tailwind CSS v4 + Lucide Icons |
| **AI Integration** | Google Gemini API + MedAssistant AI Route Handler |
| **Testing Suite** | Playwright E2E (`@playwright/test`) |
| **CI/CD Pipeline** | GitHub Actions (`.github/workflows/e2e.yml`) |
| **State Management** | React Context (`ClinicContext`) + LocalStorage Persistence |
| **Deployment** | Vercel Serverless Ready |

---

## 🧪 Panduan Menjalankan Automated Testing (Playwright)

### 1. Menjalankan E2E Test Lokal
```bash
# Menjalankan seluruh E2E test suite (Headless)
npx playwright test

# Menjalankan test dengan UI mode
npx playwright test --ui

# Menganalisis laporan HTML hasil test
npx playwright show-report
```

---

## 🚀 Panduan Deployment Ke Vercel

### Langkah 1: Push Perubahan ke GitHub
```bash
git add .
git commit -m "feat: Add Playwright E2E tests, AI Copilot & Demo Seeder"
git push origin main
```

### Langkah 2: Deploy di Vercel
1. Buka [https://vercel.com/new](https://vercel.com/new) dan login dengan akun Vercel Anda.
2. Pilih repositori **`clinic-management-system`**.
3. (Opsional) Di menu **Environment Variables**, tambahkan:
   - `GEMINI_API_KEY`: *(Key Google Gemini API Anda)*
4. Klik **Deploy**. Vercel akan otomatis melakukan kompilasi dan menerbitkan link URL domain website aktif (misal `clinic-management-system.vercel.app`).

---

## 📄 Lisensi & Hak Cipta

Copyright © 2026 **Muhammad Irfan**. All Rights Reserved.  
Sistem ini dirancang, dikembangkan, dan diuji oleh **Muhammad Irfan**.
