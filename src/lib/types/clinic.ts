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
