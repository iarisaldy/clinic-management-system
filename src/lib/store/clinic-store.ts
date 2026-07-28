'use client';

import {
  Patient,
  QueueItem,
  Medicine,
  MedicalService,
  MedicalRecord,
  Invoice,
  UserRole,
  PaymentMethod,
  QueueStatus,
  HealthCertificate,
  ReferralLetter,
  SickLeaveCertificate
} from '@/lib/types/clinic';
import { generateQueueNumber, generateInvoiceNumber } from '@/lib/utils';

// Initial Mock Data for initial state / seamless demo
export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-1',
    nik: '3273011508920001',
    name: 'Budi Santoso',
    phone: '081234567890',
    dob: '1992-08-15',
    gender: 'L',
    address: 'Jl. Sukajadi No. 45, Bandung',
    allergies: 'Penicillin',
    created_at: '2026-07-20T08:00:00Z',
  },
  {
    id: 'p-2',
    nik: '3273022204880003',
    name: 'Siti Rahmawati',
    phone: '085698765432',
    dob: '1988-04-22',
    gender: 'P',
    address: 'Jl. Merdeka No. 12, Bandung',
    allergies: 'Tidak ada',
    created_at: '2026-07-21T09:30:00Z',
  },
  {
    id: 'p-3',
    nik: '3273031011990005',
    name: 'Ahmad Rizky',
    phone: '087811223344',
    dob: '1999-11-10',
    gender: 'L',
    address: 'Jl. Dago No. 88, Bandung',
    allergies: 'Debu & Udara Dingin',
    created_at: '2026-07-22T10:15:00Z',
  },
];

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'm-1',
    code: 'OBT-001',
    name: 'Paracetamol 500mg',
    category: 'Analgesik & Antipiretik',
    unit: 'Tablet',
    sell_price: 5000,
    stock: 140,
    min_stock: 20,
  },
  {
    id: 'm-2',
    code: 'OBT-002',
    name: 'Amoxicillin 500mg',
    category: 'Antibiotik',
    unit: 'Kaplet',
    sell_price: 12000,
    stock: 75,
    min_stock: 15,
  },
  {
    id: 'm-3',
    code: 'OBT-003',
    name: 'Cetirizine 10mg',
    category: 'Antihistamin',
    unit: 'Tablet',
    sell_price: 7500,
    stock: 90,
    min_stock: 10,
  },
  {
    id: 'm-4',
    code: 'OBT-004',
    name: 'OBH Combi Batuk Flu',
    category: 'Sirup Obat Batuk',
    unit: 'Botol',
    sell_price: 24000,
    stock: 20,
    min_stock: 5,
  },
  {
    id: 'm-5',
    code: 'OBT-005',
    name: 'Vitamin C 500mg (Esther C)',
    category: 'Suplemen',
    unit: 'Strip',
    sell_price: 15000,
    stock: 4, // Trigger min stock warning!
    min_stock: 10,
  },
  {
    id: 'm-6',
    code: 'OBT-006',
    name: 'Antasida Doen',
    category: 'Antasida',
    unit: 'Tablet',
    sell_price: 4500,
    stock: 110,
    min_stock: 15,
  },
];

export const INITIAL_SERVICES: MedicalService[] = [
  {
    id: 's-1',
    code: 'SRV-001',
    name: 'Konsultasi & Pemeriksaan Dokter Umum',
    category: 'Pemeriksaan',
    price: 50000,
  },
  {
    id: 's-2',
    code: 'SRV-002',
    name: 'Pemeriksaan Gula Darah Sewaktu (GDS)',
    category: 'Laboratorium',
    price: 20000,
  },
  {
    id: 's-3',
    code: 'SRV-003',
    name: 'Pemeriksaan Kolesterol',
    category: 'Laboratorium',
    price: 35000,
  },
  {
    id: 's-4',
    code: 'SRV-004',
    name: 'Tindakan Rawat Luka Light',
    category: 'Tindakan',
    price: 40000,
  },
  {
    id: 's-5',
    code: 'SRV-005',
    name: 'Nebulizer Therapy',
    category: 'Tindakan',
    price: 60000,
  },
];

export const INITIAL_QUEUES: QueueItem[] = [
  {
    id: 'q-1',
    queue_number: 'A-001',
    patient_id: 'p-1',
    patient: INITIAL_PATIENTS[0],
    queue_date: new Date().toISOString().slice(0, 10),
    status: 'pemeriksaan', // Sedang di kamar dokter
    complaint: 'Demam 2 hari, pusing, tenggorokan sakit',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'q-2',
    queue_number: 'A-002',
    patient_id: 'p-2',
    patient: INITIAL_PATIENTS[1],
    queue_date: new Date().toISOString().slice(0, 10),
    status: 'menunggu',
    complaint: 'Batuk berdahak dan flu sejak kemarin',
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
];

export const INITIAL_RECORDS: MedicalRecord[] = [
  {
    id: 'mr-100',
    patient_id: 'p-1',
    doctor_name: 'dr. Hendra Pratama',
    systolic: 120,
    diastolic: 80,
    temperature: 36.8,
    weight: 65,
    height: 170,
    heart_rate: 78,
    anamnesis: 'Kunjungan bulan lalu: Flu ringan dan pegal linu.',
    diagnosis: 'J00 - Acute nasopharyngitis (common cold)',
    doctor_notes: 'Istirahat cukup dan banyak minum air putih.',
    prescriptions: [
      {
        medicine_id: 'm-1',
        medicine_name: 'Paracetamol 500mg',
        quantity: 10,
        unit_price: 5000,
        instruction: '3x1 tablet sesudah makan',
      },
    ],
    created_at: '2026-06-10T09:00:00Z',
  },
];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_HEALTH_CERTIFICATES: HealthCertificate[] = [
  {
    id: 'sk-1',
    letter_number: '001/SK-SEHAT/VII/2026',
    patient_id: 'p-1',
    patient: INITIAL_PATIENTS[0],
    occupation: 'Karyawan Swasta',
    purpose: 'Syarat Melamar Pekerjaan BUMN',
    height: 170,
    weight: 65,
    blood_pressure: '120/80 mmHg',
    heart_rate: 78,
    blood_type: 'O',
    color_blindness: 'Tidak',
    health_status: 'SEHAT',
    doctor_notes: 'Kondisi fisik dan vital sign dalam batas normal.',
    doctor_name: 'dr. Hendra Pratama',
    created_at: '2026-07-25T10:00:00Z',
  },
];

export const INITIAL_REFERRAL_LETTERS: ReferralLetter[] = [
  {
    id: 'sr-1',
    letter_number: '001/SR-RS/VII/2026',
    patient_id: 'p-3',
    patient: INITIAL_PATIENTS[2],
    hospital_name: 'RSUD dr. Hasan Sadikin Bandung',
    department_name: 'Poli Penyakit Dalam (Sp.PD)',
    diagnosis: 'E11 - Type 2 Diabetes Mellitus dengan Hyperglycemia',
    anamnesis_summary: 'Pasien mengeluh sering haus, cepat lelah, GDS saat diperiksa 285 mg/dL.',
    vital_signs_summary: 'TD: 135/85 mmHg, Nadi: 82x/mnt, Suhu: 36.6°C, BB: 72kg',
    treatment_given: 'Edukasi diet rendah gula, Metformin 500mg 2x1',
    referral_reason: 'Evaluasi spesialis penyakit dalam dan regulasi gula darah komprehensif.',
    doctor_name: 'dr. Hendra Pratama',
    created_at: '2026-07-26T11:30:00Z',
  },
];

export const INITIAL_SICK_LEAVE_CERTIFICATES: SickLeaveCertificate[] = [
  {
    id: 'ss-1',
    letter_number: '001/SK-SAKIT/VII/2026',
    patient_id: 'p-2',
    patient: INITIAL_PATIENTS[1],
    leave_days: 3,
    start_date: '2026-07-27',
    end_date: '2026-07-29',
    diagnosis: 'J00 - Acute Nasopharyngitis (Flu & Fever)',
    doctor_name: 'dr. Hendra Pratama',
    created_at: '2026-07-27T08:30:00Z',
  },
];

export const INITIAL_DOCTOR_PROFILE = {
  name: 'dr. Hendra Pratama, Sp.PD',
  title: 'Dokter Spesialis Penyakit Dalam',
  sip: '449/123/SIP-DR/DISKES/2024',
  str: '31.1.1.100.2.19.123456',
  clinic_name: 'Praktik Dokter Mandiri',
  address: 'Jl. R.E. Martadinata No. 88',
  city: 'Bandung',
  phone: '(022) 7201234 / 0812-3456-7890',
};


