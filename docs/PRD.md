# 📄 Product Requirement Document (PRD)

## Sistem Informasi Praktik Dokter Mandiri, EMR & AI Copilot

- **Versi Produk**: 1.1.0  
- **Pengembang**: **Muhammad Irfan**  
- **Tanggal Update**: 4 Agustus 2026  
- **Status**: Production Ready & Fully Tested (Playwright E2E)  

---

## 🎯 1. Visi & Tujuan Produk (Product Vision & Objectives)

### **Visi**
Menyediakan aplikasi Rekam Medis Elektronik (EMR), **AI Clinical Assistant**, dan Sistem Manajemen Klinik yang ringkas, cepat, elegan, serta responsif 100% di smartphone maupun desktop, khusus didesain bagi **Dokter Praktik Mandiri (Solo Practitioners)** di Indonesia.

### **Tujuan (Objectives)**
1. **Efisiensi Operasional Single-Operator**: Memungkinkan dokter melayani pasien dari pendaftaran, rekam medis, AI diagnosis ICD-10, cetak resep, penerbitan surat medis, hingga pencatatan pembayaran tanpa tergantung pada staf admin/kasir/apoteker terpisah.
2. **AI Clinical Decision Support**: Memberikan rekomendasi diagnosis ICD-10 dan saran resep obat terarah melalui integrasi AI Copilot.
3. **Penerbitan Surat Medis Instant**: Menyediakan modul pembuatan **Surat Keterangan Sehat**, **Surat Rujukan Ke Rumah Sakit**, dan **Surat Keterangan Sakit** yang auto-fill dari rekam medis EMR dan siap cetak dengan Kop Surat resmi.
4. **Automated Quality Assurance**: Menjamin keandalan aplikasi melalui suite pengujian E2E otomatis multi-browser (**Playwright**) dan CI/CD pipeline (**GitHub Actions**).

---

## 👥 2. User Personas

| Persona | Peran & Karakteristik | Kebutuhan Utama |
| :--- | :--- | :--- |
| **dr. Hendra Pratama (Dokter Praktik Mandiri)** | Dokter Umum/Spesialis yang menjalankan tempat praktik sendiri tanpa karyawan admin. | - Pemanggilan antrean cepat.<br>- Input EMR & resep obat dengan bantuan **AI Suggest ICD-10**.<br>- Floating AI Assistant untuk rujukan medis cepat.<br>- Cetak Surat Sehat & Rujukan RS dalam 1-klik.<br>- Penyesuaian Kop Surat dinamis (`/settings`). |
| **Pasien** | Pasien berobat yang membutuhkan pelayanan cepat dan dokumen surat resmi. | - Kepastian nomor antrean.<br>- Penerbitan Surat Sehat & Rujukan RS yang rapi dan sah.<br>- Bukti kuitansi/struk pembayaran transparan. |
| **Portfolio Evaluator / Recruiter** | Pihak yang meninjau kemampuan teknis pengembang. | - Tombol **`⚡ Reset Demo Data`** untuk pengujian instant.<br>- Ketersediaan E2E Testing Suite & CI/CD Pipeline yang terverifikasi. |

---

## 🧩 3. Ruang Lingkup Fitur (Feature Scope & Requirements)

### **Module 1: Dashboard Overview (`/`)**
- **FR-1.1**: Menampilkan ringkasan antrean pasien hari ini (Menunggu, Pemeriksaan, Kasir, Selesai).
- **FR-1.2**: Menampilkan indikator pendapatan harian dan statistik total pasien terdaftar.
- **FR-1.3**: Peringatan stok obat menipis (*low stock warning alert*).
- **FR-1.4**: Widget *Aksi Cepat Menu* untuk navigasi instant ke alur pelayanan utama.

### **Module 2: Pendaftaran & Manajemen Antrean (`/antrean`)**
- **FR-2.1**: Pencarian pasien lama berdasarkan Nama, NIK (16 digit), atau Nomor Telepon.
- **FR-2.2**: Form pendaftaran pasien baru (NIK, Nama, Phone, Tgl Lahir, Gender, Alamat, Riwayat Alergi).
- **FR-2.3**: Pengambilan nomor antrean harian otomatis (e.g. `A-001`) dengan catatan keluhan utama.
- **FR-2.4**: Pembaruan status antrean real-time (`Menunggu` → `Pemeriksaan` → `Kasir` → `Selesai` / `Batal`).

### **Module 3: Rekam Medis Elektronik / EMR (`/rekam-medis`)**
- **FR-3.1**: Input Tanda-Tanda Vital (TTV): Systolic, Diastolic, Suhu (°C), Berat (kg), Tinggi (cm), Nadi (bpm).
- **FR-3.2**: Pencatatan Anamnesis / Keluhan Utama dan Diagnosis ICD-10.
- **FR-3.3**: **✨ Fitur AI Suggest ICD-10 & Resep**: Tombol integrasi AI yang menganalisis anamnesis lalu mengisi diagnosis ICD-10 & saran obat secara otomatis.
- **FR-3.4**: Tabel input resep obat dinamis dengan kalkulasi harga otomatis dan validasi stok.
- **FR-3.5**: Pencatatan tindakan medis tambahan dan catatan edukasi dokter.
- **FR-3.6**: Riwayat rekam medis terdahulu (*past EMR timeline*) pasien.
- **FR-3.7**: Shortcut tombol instant ke **Cetak Surat Sehat** dan **Cetak Surat Rujukan RS**.

### **Module 4: MedAssistant AI Copilot & Floating Chatbot (`/api/ai/assistant` & `AIChatDrawer`)**
- **FR-4.1**: **Floating Chat Drawer Component**: Widget AI di pojok kanan bawah yang dapat di-expand/collapse kapan saja.
- **FR-4.2**: **Quick Action Pills**: Tombol pintas pertanyaan medis (*Demam & ICD-10*, *Resep Gastritis*, *ISPA & Batuk*).
- **FR-4.3**: **Smart Fallback Engine**: Mekanisme fallback otomatis jika API Key Gemini belum diisi sehingga demo tidak pernah error.

### **Module 5: Automated E2E Testing Suite (Playwright & CI)**
- **FR-5.1**: **Multi-Browser E2E Specs**: File test `tests/e2e/clinic-workflow.spec.ts` yang menguji alur kerja pendaftaran, EMR, kasir, surat, dan master data.
- **FR-5.2**: **GitHub Actions Pipeline**: Automasi testing otomatis di `.github/workflows/e2e.yml`.

### **Module 6: 1-Click Demo Data Generator (`DemoSeederButton`)**
- **FR-6.1**: Tombol **`⚡ Reset Demo Data`** di Navbar yang mereset dan mengisi data sample klinik (pasien, antrean, EMR, surat) secara instan.

### **Module 7: Cetak Surat Kesehatan & Rujukan RS (`/surat`)**
- **FR-7.1**: **Surat Keterangan Sehat**: Auto-fill data fisik dari EMR.
- **FR-7.2**: **Surat Rujukan Ke Rumah Sakit**: Auto-fill diagnosis & anamnesis dari EMR.
- **FR-7.3**: **Surat Keterangan Sakit (Istirahat)**: Input lama hari istirahat dan diagnosis.
- **FR-7.4**: **Kop Surat Dinamis & Engine Cetak**: Format siap cetak browser (`window.print()`).

### **Module 8: Kasir & Pembayaran (`/kasir`)**
- **FR-8.1**: Rincian tagihan otomatis (Konsultasi + Tindakan + Resep Obat).
- **FR-8.2**: Otomasi pemotongan stok obat terbeban saat invoice dilunasi.

### **Module 9: Master Data & Pengaturan (`/master` & `/settings`)**
- **FR-9.1**: CRUD Master Obat & Master Tarif Layanan Dokter.
- **FR-9.2**: Pengaturan Profil Dokter & Live Preview Kop Surat.

---

## ⚡ 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)

1. **Mobile Responsiveness**: 100% responsif di layar smartphone (320px+) dengan *Mobile Drawer Navigation* (☰) dan *Mobile Bottom Navigation Bar*.
2. **Kinerja & Kecepatan**: Waktu muat halaman < 1.5 detik dengan arsitektur Next.js 16 App Router & Turbopack.
3. **Peningkatan Kualitas (QA)**: Dikover oleh Playwright E2E Test Suite (12/12 Specs Passed).
4. **Keamanan & Hak Cipta**: Dilengkapi kredensial hak cipta dan lisensi resmi atas nama **Muhammad Irfan**.
