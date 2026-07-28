# 📖 Panduan Pengguna (User Manual)

## Sistem Informasi Praktik Dokter Mandiri & EMR

- **Pengembang**: **Muhammad Irfan**  
- **Peruntukan**: Dokter Praktik Mandiri (Solo Practitioners)  
- **Akses Web**: `https://clinic-management-system-seven-mu.vercel.app/`  

---

Selamat datang di **Sistem Informasi Praktik Dokter Mandiri**. Aplikasi ini dirancang khusus untuk membantu Anda mengelola pendaftaran pasien, rekam medis (EMR), penerbitan Surat Sehat & Rujukan RS, serta kuitansi pembayaran secara mandiri, cepat, dan 100% responsif dari laptop, tablet, maupun HP Anda.

---

## 📑 Daftar Isi Panduan
1. [Langkah 1: Pengaturan Profil Dokter & Kop Surat (`/settings`)](#langkah-1-pengaturan-profil-dokter--kop-surat-settings)
2. [Langkah 2: Pendaftaran Pasien & Ambil Antrean (`/antrean`)](#langkah-2-pendaftaran-pasien--ambil-antrean-antrean)
3. [Langkah 3: Mengisi Rekam Medis (EMR) & Resep Obat (`/rekam-medis`)](#langkah-3-mengisi-rekam-medis-emr--resep-obat-rekam-medis)
4. [Langkah 4: Mencetak Surat Kesehatan & Rujukan RS (`/surat`)](#langkah-4-mencetak-surat-kesehatan--rujukan-rs-surat)
5. [Langkah 5: Memproses Pembayaran Kasir & Struk (`/kasir`)](#langkah-5-memproses-pembayaran-kasir--struk-kasir)
6. [Langkah 6: Mengelola Data Obat & Tarif Dokter (`/master`)](#langkah-6-mengelola-data-obat--tarif-dokter-master)

---

### ⚙️ Langkah 1: Pengaturan Profil Dokter & Kop Surat (`/settings`)

Sebelum mulai melayani pasien, disarankan untuk melengkapi identitas praktik Anda:

1. Buka menu **Pengaturan Profil** (`/settings`).
2. Isi kolom yang tersedia:
   - **Nama Lengkap & Gelar**: Contoh `dr. Hendra Pratama, Sp.PD`
   - **Spesialisasi / Jabatan**: Contoh `Dokter Spesialis Penyakit Dalam`
   - **Nomor SIP**: Contoh `449/123/SIP-DR/DISKES/2024`
   - **Nomor STR**: Contoh `31.1.1.100.2.19.123456`
   - **Nama Tempat Praktik**: Contoh `Praktik Dokter Mandiri`
   - **Alamat & Kota Praktik**: Contoh `Jl. R.E. Martadinata No. 88, Bandung`
   - **No. Telepon / WhatsApp**: Contoh `(022) 7201234 / 0812-3456-7890`
3. Perhatikan **Live Preview Kop Surat** di sebelah kanan layar untuk melihat tampilan Kop Surat simulasi.
4. Klik **Simpan Pengaturan Profil**. Data ini akan otomatis digunakan di seluruh surat cetak Anda!

---

### 🎫 Langkah 2: Pendaftaran Pasien & Ambil Antrean (`/antrean`)

#### **a. Mendaftarkan Pasien Baru:**
1. Masuk ke menu **Pendaftaran & Antrean** (`/antrean`).
2. Klik tombol **Daftarkan Pasien Baru**.
3. Isi data identitas (NIK 16 digit, Nama Lengkap, No. HP, Tgl Lahir, Jenis Kelamin, Alamat, dan Riwayat Alergi).
4. Klik **Simpan & Daftarkan Pasien**. Pasien otomatis tersimpan di database.

#### **b. Mengambil Nomor Antrean Pasien:**
1. Masukkan Nama / NIK pasien pada kolom pencarian.
2. Klik tombol **Ambil Antrean** di samping nama pasien.
3. Masukkan keluhan utama pasien (misal: *Demam 2 hari, Pusing*).
4. Klik **Cetak & Masukkan Antrean**. Nomor antrean (misal `A-001`) otomatis terbit dengan status **MENUNGGU**.

---

### 🩺 Langkah 3: Mengisi Rekam Medis (EMR) & Resep Obat (`/rekam-medis`)

1. Buka menu **Rekam Medis (EMR)** (`/rekam-medis`).
2. Pilih antrean pasien yang akan diperiksa pada dropdown **Antrean Pasien**.
3. Isi **Tanda-Tanda Vital (TTV)**: Systolic, Diastolic, Suhu (°C), Berat (kg), Tinggi (cm), Nadi (bpm).
4. Catat **Anamnesis** dan **Diagnosis ICD-10** (Anda dapat mengklik rekomendasi *Quick Diagnosis Tags* untuk pengisian cepat).
5. Input **Resep Obat Dinamis**:
   - Pilih obat dari daftar master obat.
   - Isi jumlah (Qty) dan aturan pakai (misal: *3x1 Sesudah Makan*).
   - Klik **+ Tambah**.
6. (Opsional) Pilih **Tindakan Tambahan** dan tulis **Catatan Dokter**.
7. Jika pasien membutuhkan Surat Sehat atau Rujukan RS, Anda dapat mengklik tombol shortcut **📜 Surat Sehat** atau **🏥 Rujukan RS** di bagian bawah form.
8. Klik **Simpan EMR Pasien**.

---

### 📜 Langkah 4: Mencetak Surat Kesehatan & Rujukan RS (`/surat`)

Aplikasi menyediakan 3 jenis surat medis resmi:

#### **a. Surat Keterangan Sehat (Tab 1):**
1. Pilih Pasien. (Data tinggi badan, berat badan, dan tensi akan terisi otomatis dari EMR terakhir).
2. Isi Pekerjaan, Keperluan Surat (misal: *Syarat Melamar Pekerjaan*), Golongan Darah, Buta Warna, dan Kesimpulan (`SEHAT` / `TIDAK SEHAT`).
3. Klik **Buat & Pratinjau Cetak Surat Sehat**.
4. Di jendela pratinjau, klik **Cetak Sekarang (Print / PDF)**.

#### **b. Surat Rujukan Ke Rumah Sakit (Tab 2):**
1. Pilih Pasien.
2. Isi Nama RS Tujuan (misal: *RSUD dr. Hasan Sadikin*) dan Poli Tujuan (misal: *Poli Penyakit Dalam*).
3. Periksa ringkasan diagnosis, anamnesis, TTV, terapi yang diberikan, dan alasan rujukan medis.
4. Klik **Buat & Pratinjau Cetak Surat Rujukan**.

#### **c. Surat Keterangan Sakit / Istirahat (Tab 3):**
1. Pilih Pasien.
2. Isi Jumlah Hari Istirahat, Tanggal Mulai s/d Selesai, dan Diagnosis.
3. Klik **Buat & Pratinjau Cetak Surat Sakit**.

---

### 💳 Langkah 5: Memproses Pembayaran Kasir & Struk (`/kasir`)

1. Buka menu **Kasir & Pembayaran** (`/kasir`).
2. Pilih antrean pasien yang telah selesai diperiksa dokter.
3. Rincian biaya konsultasi, obat, dan tindakan akan dihitung secara otomatis.
4. Klik **Proses Pembayaran**.
5. Pilih metode pembayaran (`Cash`, `QRIS`, `Transfer`) dan masukkan nominal uang bayar.
6. Klik **Konfirmasi Pembayaran & Pelunasan**. Stok obat otomatis terpotong di sistem, dan Anda dapat mengklik **Cetak Struk Pembayaran**.

---

### 📦 Langkah 6: Mengelola Data Obat & Tarif Dokter (`/master`)

- **Master Data Obat (`/master/obat`)**: Menambah obat baru, memperbarui stok, dan mengatur batas minimal stok (*low stock warning*).
- **Tarif Layanan Dokter (`/master/tarif`)**: Menyesuaikan tarif konsultasi dokter dan prosedur tindakan medis.

---

### 📲 Penggunaan di Smartphone / HP

Saat diakses via HP:
- Gunakan **Tombol Hamburger (☰)** di kiri atas header untuk membuka menu samping.
- Atau gunakan **Navigation Bar Bawah** (Dashboard, Antrean, EMR, Surat, Kasir) untuk navigasi instan 1 jempol.

---

Hak Cipta © 2026 **Muhammad Irfan**. All Rights Reserved.
