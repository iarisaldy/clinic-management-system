-- Schema SQL untuk Sistem Informasi Praktik Dokter Sederhana (Light EMR)
-- PostgreSQL / Supabase Migration

-- Enable extension for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Patients Table
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nik VARCHAR(16) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('L', 'P')),
    address TEXT NOT NULL,
    allergies TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Medicines Master Data Table
CREATE TABLE IF NOT EXISTS public.medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    unit TEXT NOT NULL,
    sell_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    min_stock INT NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Services / Action Fees Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Daily Queues Table
CREATE TABLE IF NOT EXISTS public.queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_number TEXT NOT NULL,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    queue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'pemeriksaan', 'kasir', 'selesai', 'batal')),
    complaint TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Medical Records Table
CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_id UUID REFERENCES public.queues(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_name TEXT NOT NULL DEFAULT 'dr. Hendra Pratama',
    systolic INT,
    diastolic INT,
    temperature NUMERIC(4, 1),
    weight NUMERIC(5, 1),
    height NUMERIC(5, 1),
    heart_rate INT,
    anamnesis TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    doctor_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Prescription Items Table
CREATE TABLE IF NOT EXISTS public.prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medical_record_id UUID NOT NULL REFERENCES public.medical_records(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES public.medicines(id) ON DELETE RESTRICT,
    medicine_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    instruction TEXT NOT NULL
);

-- 7. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
    queue_id UUID REFERENCES public.queues(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
    medical_record_id UUID REFERENCES public.medical_records(id) ON DELETE SET NULL,
    consultation_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    action_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    medicine_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    change_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'qris', 'transfer')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_patients_nik ON public.patients(nik);
CREATE INDEX IF NOT EXISTS idx_patients_name ON public.patients(name);
CREATE INDEX IF NOT EXISTS idx_queues_date_status ON public.queues(queue_date, status);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON public.medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(payment_status);

-- Function & Trigger: Automatic Medicine Stock Reduction when Invoice is Paid
CREATE OR REPLACE FUNCTION process_invoice_payment()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status = 'unpaid')) THEN
        -- Update queue status to selesai
        IF NEW.queue_id IS NOT NULL THEN
            UPDATE public.queues SET status = 'selesai' WHERE id = NEW.queue_id;
        END IF;

        -- Deduct stock for medicines in prescription
        IF NEW.medical_record_id IS NOT NULL THEN
            UPDATE public.medicines m
            SET stock = GREATEST(0, m.stock - pi.quantity)
            FROM public.prescription_items pi
            WHERE pi.medical_record_id = NEW.medical_record_id
              AND pi.medicine_id = m.id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_process_invoice_payment ON public.invoices;
CREATE TRIGGER trg_process_invoice_payment
AFTER UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION process_invoice_payment();
