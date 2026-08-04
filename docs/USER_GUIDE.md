# 📖 Panduan Pengguna (User Manual)

## Sistem Informasi Praktik Dokter Mandiri, EMR & AI Copilot

- **Pengembang**: **Muhammad Irfan**  
- **Peruntukan**: Dokter Praktik Mandiri (Solo Practitioners)  
- **Akses Web**: `https://clinic-management-system-seven-mu.vercel.app/`  

---

Selamat datang di **Sistem Informasi Praktik Dokter Mandiri**. Aplikasi ini dirancang khusus untuk membantu Anda mengelola pendaftaran pasien, rekam medis (EMR), rekomendasi AI ICD-10, penerbitan Surat Sehat & Rujukan RS, serta kuitansi pembayaran secara mandiri, cepat, dan 100% responsif dari laptop, tablet, maupun HP Anda.

---

## 📑 Daftar Isi Panduan
1. [Langkah 1: Pengaturan Profil Dokter & Kop Surat (`/settings`)](#langkah-1-pengaturan-profil-dokter--kop-surat-settings)
2. [Langkah 2: Pendaftaran Pasien & Ambil Antrean (`/antrean`)](#langkah-2-pendaftaran-pasien--ambil-antrean-antrean)
3. [Langkah 3: Mengisi Rekam Medis (EMR) & Bantuan AI (`/rekam-medis`)](#langkah-3-mengisi-rekam-medis-emr--bantuan-ai-rekam-medis)
4. [Langkah 4: Menggunakan MedAssistant AI Chatbot (Widget Kanan Bawah)](#langkah-4-menggunakan-medassistant-ai-chatbot-widget-kanan-bawah)
5. [Langkah 5: Mencetak Surat Kesehatan & Rujukan RS (`/surat`)](#langkah-5-mencetak-surat-kesehatan--rujukan-rs-surat)
6. [Langkah 6: Memproses Pembayaran Kasir & Struk (`/kasir`)](#langkah-6-memproses-pembayaran-kasir--struk-kasir)
7. [Langkah 7: Mengelola Data Obat & Tarif Dokter (`/master`)](#langkah-7-mengelola-data-obat--tarif-dokter-master)
8. [Langkah 8: Menggunakan Tombol ⚡ Reset Demo Data](#langkah-8-menggunakan-tombol--reset-demo-data)

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

### 🩺 Langkah 3: Mengisi Rekam Medis (EMR) & Bantuan AI (`/rekam-medis`)

1. Buka menu **Rekam Medis (EMR)** (`/rekam-medis`).
2. Pilih antrean pasien yang akan diperiksa pada dropdown **Antrean Pasien**.
3. Isi **Tanda-Tanda Vital (TTV)**: Systolic, Diastolic, Suhu (°C), Berat (kg), Tinggi (cm), Nadi (bpm).
4. Catat **Anamnesis** / Keluhan Utama Pasien.
5. **✨ Menggunakan Fitur AI Suggest ICD-10**:
   - Klik tombol **`✨ AI Suggest ICD-10`** di samping label Diagnosis.
   - AI akan secara otomatis menganalisis anamnesis dan mengisikan kode diagnosis ICD-10 serta saran resep obat.
6. Input **Resep Obat Dinamis**:
   - Pilih obat dari daftar master obat.
   - Isi jumlah (Qty) dan aturan pakai (misal: *3x1 Sesudah Makan*).
   - Klik **+ Tambah**.
7. (Opsional) Pilih **Tindakan Tambahan** dan tulis **Catatan Dokter**.
8. Jika pasien membutuhkan Surat Sehat atau Rujukan RS, Anda dapat mengklik tombol shortcut **📜 Surat Sehat** atau **🏥 Rujukan RS** di bagian bawah form.
9. Klik **Simpan EMR Pasien**.

---

### 💬 Langkah 4: Menggunakan MedAssistant AI Chatbot (Widget Kanan Bawah)

1. Klik tombol melayang **`MedAssistant AI`** di pojok kanan bawah layar.
2. Anda dapat mengetik pertanyaan medis bebas atau menggunakan **Quick Action Pills**:
   - 🤒 *Demam & ICD-10*
   - 💊 *Resep Gastritis*
   - 🫁 *ISPA & Batuk*
3. AI akan memberikan jawaban akurat terstruktur mengenai diagnosis ICD-10, saran dosis obat, atau triase gejala pasien.

---

### 📜 Langkah 5: Mencetak Surat Kesehatan & Rujukan RS (`/surat`)

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

### 💳 Langkah 6: Memproses Pembayaran Kasir & Struk (`/kasir`)

1. Buka menu **Kasir & Pembayaran** (`/kasir`).
2. Pilih antrean pasien yang telah selesai diperiksa dokter.
3. Rincian biaya konsultasi, obat, dan tindakan akan dihitung secara otomatis.
4. Klik **Proses Pembayaran**.
5. Pilih metode pembayaran (`Cash`, `QRIS`, `Transfer`) dan masukkan nominal uang bayar.
6. Klik **Konfirmasi Pembayaran & Pelunasan**. Stok obat otomatis terpotong di sistem, dan Anda dapat mengklik **Cetak Struk Pembayaran**.

---

### 📦 Langkah 7: Mengelola Data Obat & Tarif Dokter (`/master`)

- **Master Data Obat (`/master/obat`)**: Menambah obat baru, memperbarui stok, dan mengatur batas minimal stok (*low stock warning*).
- **Tarif Layanan Dokter (`/master/tarif`)**: Menyesuaikan tarif konsultasi dokter dan prosedur tindakan medis.

---

### ⚡ Langkah 8: Menggunakan Tombol ⚡ Reset Demo Data

Jika Anda ingin menguji sistem dari awal atau memamerkan aplikasi kepada pihak lain:
1. Klik tombol **`⚡ Reset Demo Data`** pada bagian atas Navbar.
2. Konfirmasi dialog. Sistem akan memuat ulang data dummy antrean, EMR, dan surat medis secara instan dalam 1 detik.

---

Hak Cipta © 2026 **Muhammad Irfan**. All Rights Reserved.
