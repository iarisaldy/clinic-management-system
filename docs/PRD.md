# 📄 Product Requirement Document (PRD)

## Sistem Informasi Praktik Dokter Mandiri & EMR

- **Versi Produk**: 1.0.0  
- **Pengembang**: **Muhammad Irfan**  
- **Tanggal**: 28 Juli 2026  
- **Status**: Production Ready  

---

## 🎯 1. Visi & Tujuan Produk (Product Vision & Objectives)

### **Visi**
Menyediakan aplikasi Rekam Medis Elektronik (EMR) dan Sistem Manajemen Klinik yang ringkas, cepat, elegan, serta responsif 100% di smartphone maupun desktop, khusus didesain bagi **Dokter Praktik Mandiri (Solo Practitioners)** di Indonesia.

### **Tujuan (Objectives)**
1. **Efisiensi Operasional Single-Operator**: Memungkinkan dokter melayani pasien dari pendaftaran, rekam medis, cetak resep, penerbitan surat medis, hingga pencatatan pembayaran tanpa tergantung pada staf admin/kasir/apoteker terpisah.
2. **Penerbitan Surat Medis Instant**: Menyediakan modul pembuatan **Surat Keterangan Sehat**, **Surat Rujukan Ke Rumah Sakit**, dan **Surat Keterangan Sakit** yang auto-fill dari rekam medis EMR dan siap cetak dengan Kop Surat resmi.
3. **Kemudahan Aksesibilitas**: Responsif 100% di perangkat smartphone, tablet, dan komputer desktop.
4. **Kepatuhan Standar Rekam Medis**: Menyediakan pencatatan vital sign (TTV), ICD-10 diagnosis, anamnesis, dan resep obat yang aman.

---

## 👥 2. User Personas

| Persona | Peran & Karakteristik | Kebutuhan Utama |
| :--- | :--- | :--- |
| **dr. Hendra Pratama (Dokter Praktik Mandiri)** | Dokter Umum/Spesialis yang menjalankan tempat praktik sendiri tanpa karyawan admin. | - Pemanggilan antrean cepat.<br>- Input EMR & resep obat tanpa ribet.<br>- Cetak Surat Sehat & Rujukan RS dalam 1-klik.<br>- Penyesuaian Kop Surat dinamis (`/settings`). |
| **Pasien** | Pasien berobat yang membutuhkan pelayanan cepat dan dokumen surat resmi. | - Kepastian nomor antrean.<br>- Penerbitan Surat Sehat & Rujukan RS yang rapi dan sah.<br>- Bukti kuitansi/struk pembayaran transparan. |

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
- **FR-3.2**: Pencatatan Anamnesis / Keluhan Utama dan Diagnosis ICD-10 (disertai rekomendasi *Quick Diagnosis Tags*).
- **FR-3.3**: Tabel input resep obat dinamis dengan kalkulasi harga otomatis dan validasi stok.
- **FR-3.4**: Pencatatan tindakan medis tambahan dan catatan edukasi dokter.
- **FR-3.5**: Riwayat rekam medis terdahulu (*past EMR timeline*) pasien.
- **FR-3.6**: Shortcut tombol instant ke **Cetak Surat Sehat** dan **Cetak Surat Rujukan RS**.

### **Module 4: Cetak Surat Kesehatan & Rujukan RS (`/surat`)**
- **FR-4.1**: **Surat Keterangan Sehat**:
  - Auto-fill data fisik dari EMR (TB, BB, Tekanan Darah, Nadi, Golongan Darah, Buta Warna).
  - Input Keperluan Surat (Melamar Pekerjaan, Syarat Sekolah/Kuliah, SIM, KKN, dsb.).
  - Kesimpulan Status Kesehatan (`SEHAT` / `TIDAK SEHAT`).
- **FR-4.2**: **Surat Rujukan Ke Rumah Sakit**:
  - Auto-fill diagnosis & anamnesis dari EMR.
  - Input RS Tujuan & Poli/Dokter Spesialis Tujuan.
  - Input Ringkasan TTV, Terapi yang Telah Diberikan, dan Alasan Rujukan Medis.
- **FR-4.3**: **Surat Keterangan Sakit (Istirahat)**:
  - Input lama hari istirahat, tanggal mulai s/d tanggal selesai, dan diagnosis.
- **FR-4.4**: **Kop Surat Dinamis & Engine Cetak**:
  - Template Kop Surat resmi Dokter Praktik Mandiri dengan format cetak browser (`window.print()` / PDF).
- **FR-4.5**: **Riwayat Surat Terbit**: Log rekapitulasi seluruh surat terbit yang dapat dicetak ulang (*reprint*).

### **Module 5: Kasir & Pembayaran (`/kasir`)**
- **FR-5.1**: Rincian tagihan otomatis (Biaya Konsultasi + Biaya Tindakan + Total Resep Obat).
- **FR-5.2**: Pilihan metode pembayaran (`Cash`, `QRIS`, `Transfer`).
- **FR-5.3**: Kalkulasi uang bayar & kembalian.
- **FR-5.4**: Penerbitan kuitansi / struk pembayaran siap cetak.
- **FR-5.5**: Otomasi pemotongan stok obat terbeban saat invoice dilunasi.

### **Module 6: Master Data Management (`/master/obat` & `/master/tarif`)**
- **FR-6.1**: CRUD Master Obat (Kode, Nama Obat, Kategori, Satuan, Harga Jual, Stok, Min Stok).
- **FR-6.2**: CRUD Master Tarif Layanan / Tindakan Dokter (Kode, Nama Tindakan, Kategori, Tarif).

### **Module 7: Pengaturan Profil Dokter & Kop Surat (`/settings`)**
- **FR-7.1**: Form pengisian Profil Dokter (Nama & Gelar, Spesialisasi, No. SIP, No. STR, Nama Tempat Praktik, Alamat, Kota, No. HP/WA).
- **FR-7.2**: **Live Preview Kop Surat** real-time.
- **FR-7.3**: Pengkinian data Kop Surat dan navigasi sistem secara dinamis.

---

## ⚡ 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)

1. **Mobile Responsiveness**: 100% responsif di layar smartphone (320px+) dengan *Mobile Drawer Navigation* (☰) dan *Mobile Bottom Navigation Bar*.
2. **Kinerja & Kecepatan**: Waktu muat halaman < 1.5 detik dengan arsitektur Next.js 16 App Router & Turbopack.
3. **Persistensi Data**: Penyimpanan state lokal aman menggunakan `localStorage` untuk mode demo zero-config, dan siap dihubungkan ke Supabase PostgreSQL untuk mode cloud.
4. **Keamanan & Hak Cipta**: Dilengkapi kredensial hak cipta dan lisensi resmi atas nama **Muhammad Irfan**.
