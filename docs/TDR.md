# 🏗️ Technical Design Requirement (TDR)

## Arsitektur Teknis Sistem Informasi Praktik Dokter Mandiri

- **Versi Dokumen**: 1.0.0  
- **Lead Architect / Developer**: **Muhammad Irfan**  
- **Tanggal**: 28 Juli 2026  

---

## 🛠️ 1. Stack Teknologi & Spesifikasi Perangkat Lunak

| Lapisan (Layer) | Teknologi / Library | Versi | Alasan Pemilihan |
| :--- | :--- | :--- | :--- |
| **Framework Utama** | Next.js (App Router) | `16.2.11` | Server-side rendering cepat, Turbopack build engine, file-system routing. |
| **Bahasa Pemrograman**| TypeScript | `5.x` | Type-safety ketat, mencegah runtime type bugs pada kalkulasi medis & tagihan. |
| **UI Library & Core** | React | `19.2.4` | Declarative UI, hooks, and React 19 performance optimizations. |
| **Styling & Design System**| Tailwind CSS | `v4` | Styling utilitas responsif modern, custom dark/light mode tokens. |
| **Ikonografi** | Lucide React | `1.26.0` | Ikon medis & UI SVG yang bersih dan konsisten. |
| **Database & Auth (Cloud)**| Supabase (PostgreSQL) | `2.110.8` | Cloud DB PostgreSQL gratis tier besar, Auth, & RLS security. |
| **Deployment & Hosting**| Vercel Cloud Platform | Production | CI/CD otomatis dari GitHub, Edge CDN global, SSL gratis. |

---

## 📁 2. Struktur Proyek & Arsitektur Kode

```text
clinic-management-system/
├── docs/                      # Dokumentasi Sistem (PRD, TDR, User Guide, Roadmap)
│   ├── PRD.md
│   ├── TDR.md
│   ├── USER_GUIDE.md
│   └── SAAS_ROADMAP.md
├── public/                    # Aset Statis Website
├── src/
│   ├── app/                   # Next.js 16 App Router Routes
│   │   ├── page.tsx           # Dashboard Overview
│   │   ├── antrean/page.tsx   # Pendaftaran & Antrean Pasien
│   │   ├── rekam-medis/page.tsx# Ruang Rekam Medis (EMR)
│   │   ├── surat/page.tsx     # Cetak Surat Sehat, Rujukan RS & Sakit
│   │   ├── kasir/page.tsx     # Kasir & Pembayaran Struk
│   │   ├── master/
│   │   │   ├── obat/page.tsx  # Master Data Obat
│   │   │   └── tarif/page.tsx # Master Data Tarif Layanan
│   │   ├── settings/page.tsx  # Pengaturan Profil Dokter & Kop Surat
│   │   ├── laporan/page.tsx   # Laporan & Rekapitulasi Keuangan
│   │   ├── layout.tsx         # Root Layout dengan Provider & Responsive Shell
│   │   └── globals.css        # Tailwind CSS Global Rules & Media Print Styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx     # Header Brand & Status Dokter
│   │   │   ├── Sidebar.tsx    # Desktop Sidebar Navigation (lg:flex)
│   │   │   └── MobileNav.tsx  # Hamburger Toggle, Drawer Overlay & Mobile Bottom Nav Bar
│   │   └── ui/                # Base Design System Components
│   │       ├── Badge.tsx      # Multi-variant Status Badges
│   │       ├── Button.tsx     # Variant Action Buttons
│   │       ├── Card.tsx       # Container Cards
│   │       ├── Input.tsx      # Standardized Form Inputs & Selects
│   │       └── Modal.tsx      # Accessible Dialog Modals
│   └── lib/
│       ├── store/
│       │   ├── ClinicContext.tsx # Central React Context State Manager
│       │   └── clinic-store.ts  # Initial Mock Seed Data
│       ├── types/
│       │   └── clinic.ts      # TypeScript Models & Interfaces
│       ├── supabase/
│       │   └── client.ts      # Supabase Client Initializer
│       └── utils.ts           # Utility Functions (Rupiah Formatter, Age Calculator, Date Formatter)
├── LICENSE                    # Hak Cipta © 2026 Muhammad Irfan
├── README.md                  # Dokumentasi Utama GitHub
└── package.json
```

---

## 🗄️ 3. Data Models (TypeScript Interfaces)

### `DoctorProfile`
```ts
export interface DoctorProfile {
  name: string;          // e.g. "dr. Hendra Pratama, Sp.PD"
  title: string;         // e.g. "Dokter Spesialis Penyakit Dalam"
  sip: string;           // e.g. "449/123/SIP-DR/DISKES/2024"
  str: string;           // e.g. "31.1.1.100.2.19.123456"
  clinic_name: string;   // e.g. "Praktik Dokter Mandiri"
  address: string;       // e.g. "Jl. R.E. Martadinata No. 88"
  city: string;          // e.g. "Bandung"
  phone: string;         // e.g. "(022) 7201234 / 0812-3456-7890"
  logo_url?: string;
  signature_url?: string;
}
```

### `HealthCertificate`
```ts
export interface HealthCertificate {
  id: string;
  letter_number: string; // e.g. "001/SK-SEHAT/VII/2026"
  patient_id: string;
  patient?: Patient;
  occupation: string;
  purpose: string;
  height: number;        // cm
  weight: number;        // kg
  blood_pressure: string;// e.g. "120/80 mmHg"
  heart_rate?: number;
  blood_type: string;
  color_blindness: 'Tidak' | 'Parsial' | 'Ya';
  health_status: 'SEHAT' | 'TIDAK SEHAT';
  doctor_notes?: string;
  doctor_name: string;
  created_at: string;
}
```

### `ReferralLetter`
```ts
export interface ReferralLetter {
  id: string;
  letter_number: string; // e.g. "001/SR-RS/VII/2026"
  patient_id: string;
  patient?: Patient;
  hospital_name: string;
  department_name: string;
  diagnosis: string;
  anamnesis_summary: string;
  vital_signs_summary: string;
  treatment_given: string;
  referral_reason: string;
  doctor_name: string;
  created_at: string;
}
```

---

## 📱 4. Arsitektur Tampilan Responsif Mobile (Mobile Responsive Design)

Untuk menjamin aplikasi dapat diakses 100% dengan nyaman pada layar smartphone (320px–480px), tablet, dan desktop:

1. **Desktop View (`lg:flex` - 1024px+)**:
   - Sidebar navigasi tetap ditampilkan di sebelah kiri.
   - Header top bar menampilkan status dokter dan jam real-time.
2. **Mobile View (`< 1024px`)**:
   - Sidebar desktop tersembunyi (`hidden lg:flex`).
   - **Header Navigation**: Tombol Hamburger (☰ / `MobileHeaderToggle`) di Navbar memicu **Mobile Drawer Overlay** yang meluncur dari kiri.
   - **Mobile Bottom Navigation Bar (`MobileBottomNav`)**: Navigasi melayang di bagian bawah layar dengan 5 ikon utama untuk akses 1 jempol (`Dashboard`, `Antrean`, `EMR`, `Surat`, `Kasir`).
   - Padding kontainer utama diberi `pb-20 lg:pb-8` agar elemen halaman tidak tertutup navigasi bawah.

---

## 🖨️ 5. Mesin Cetak Surat & Kuitansi (Print Engine)

- Menggunakan **HTML/CSS Native Print Styles** (`@media print`).
- Elemen UI non-cetak (Navbar, Sidebar, Button) disembunyikan otomatis saat dialog cetak dipanggil.
- Kontainer dokumen cetak (`#printable-letter-container`) dirender dengan rasio kertas standar A4/F4, font sans-serif bersih, dan Kop Surat resmi Praktik Dokter Mandiri.
- Pemicu pencetakan dieksekusi melalui panggilan native `window.print()`.

---

## 🚀 6. CI/CD & Deployment Pipeline

- **Repository**: GitHub (`https://github.com/iarisaldy/clinic-management-system`)
- **Hosting Platform**: Vercel Cloud Platform
- **Triggers**: Setiap perintah `git push origin main` secara otomatis memicu Vercel Build Worker.
- **Build Verification**: Perintah `npm run build` mengeksekusi kompilasi TypeScript dan Next.js static page generation (10 rute).
