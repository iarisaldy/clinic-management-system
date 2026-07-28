export type UserRole = 'admin' | 'dokter';

export interface Patient {
  id: string;
  nik: string;
  name: string;
  phone: string;
  dob: string; // YYYY-MM-DD
  gender: 'L' | 'P';
  address: string;
  allergies?: string;
  created_at?: string;
}

export type QueueStatus = 'menunggu' | 'pemeriksaan' | 'kasir' | 'selesai' | 'batal';

export interface QueueItem {
  id: string;
  queue_number: string; // e.g. "A-001"
  patient_id: string;
  patient?: Patient;
  queue_date: string; // YYYY-MM-DD
  status: QueueStatus;
  complaint?: string;
  created_at: string;
}

export interface Medicine {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  sell_price: number;
  stock: number;
  min_stock: number;
  created_at?: string;
}

export interface MedicalService {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  created_at?: string;
}

export interface PrescriptionItem {
  id?: string;
  medicine_id: string;
  medicine_name: string;
  quantity: number;
  unit_price: number;
  instruction: string; // e.g. "3x1 Sesudah Makan"
}

export interface MedicalRecord {
  id: string;
  queue_id?: string;
  patient_id: string;
  patient?: Patient;
  doctor_name: string;
  systolic?: number;
  diastolic?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  heart_rate?: number;
  anamnesis: string;
  diagnosis: string;
  doctor_notes?: string;
  prescriptions: PrescriptionItem[];
  created_at: string;
}

export type PaymentMethod = 'cash' | 'qris' | 'transfer';
export type PaymentStatus = 'unpaid' | 'paid';

export interface Invoice {
  id: string;
  invoice_number: string; // e.g. "INV/20260723/001"
  queue_id?: string;
  patient_id: string;
  patient?: Patient;
  medical_record_id?: string;
  medical_record?: MedicalRecord;
  consultation_fee: number;
  action_fee: number;
  medicine_fee: number;
  total_amount: number;
  paid_amount: number;
  change_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  paid_at?: string;
  created_at: string;
}

export interface HealthCertificate {
  id: string;
  letter_number: string; // e.g. "001/SK-SEHAT/VII/2026"
  patient_id: string;
  patient?: Patient;
  occupation: string;
  purpose: string; // e.g. "Persyaratan Melamar Pekerjaan"
  height: number; // cm
  weight: number; // kg
  blood_pressure: string; // e.g. "120/80 mmHg"
  heart_rate?: number; // bpm
  blood_type: string; // e.g. "A", "B", "AB", "O", "-"
  color_blindness: 'Tidak' | 'Parsial' | 'Ya';
  health_status: 'SEHAT' | 'TIDAK SEHAT';
  doctor_notes?: string;
  doctor_name: string;
  created_at: string;
}

export interface ReferralLetter {
  id: string;
  letter_number: string; // e.g. "001/SR-RS/VII/2026"
  patient_id: string;
  patient?: Patient;
  hospital_name: string; // e.g. "RSUD dr. Soetomo"
  department_name: string; // e.g. "Poli Penyakit Dalam"
  diagnosis: string; // e.g. "J00 - Acute Nasopharyngitis"
  anamnesis_summary: string;
  vital_signs_summary: string;
  treatment_given: string;
  referral_reason: string; // e.g. "Evaluasi Spesialis & Penanganan Lebih Lanjut"
  doctor_name: string;
  created_at: string;
}

export interface SickLeaveCertificate {
  id: string;
  letter_number: string; // e.g. "001/SK-SAKIT/VII/2026"
  patient_id: string;
  patient?: Patient;
  leave_days: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  diagnosis: string;
  doctor_name: string;
  created_at: string;
}

export interface DoctorProfile {
  name: string; // e.g. "dr. Hendra Pratama, Sp.PD"
  title: string; // e.g. "Dokter Spesialis Penyakit Dalam"
  sip: string; // e.g. "449/123/SIP-DR/DISKES/2024"
  str: string; // e.g. "31.1.1.100.2.19.123456"
  clinic_name: string; // e.g. "Praktik Dokter Mandiri"
  address: string; // e.g. "Jl. R.E. Martadinata No. 88"
  city: string; // e.g. "Bandung"
  phone: string; // e.g. "(022) 7201234 / 0812-3456-7890"
  logo_url?: string;
  signature_url?: string;
}


