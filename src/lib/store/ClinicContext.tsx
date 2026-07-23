'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Patient,
  QueueItem,
  Medicine,
  MedicalService,
  MedicalRecord,
  Invoice,
  QueueStatus,
  PaymentMethod,
  PrescriptionItem
} from '@/lib/types/clinic';
import {
  INITIAL_PATIENTS,
  INITIAL_MEDICINES,
  INITIAL_SERVICES,
  INITIAL_QUEUES,
  INITIAL_RECORDS,
  INITIAL_INVOICES
} from './clinic-store';
import { generateQueueNumber, generateInvoiceNumber } from '@/lib/utils';

interface ClinicContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  patients: Patient[];
  queues: QueueItem[];
  medicines: Medicine[];
  services: MedicalService[];
  medicalRecords: MedicalRecord[];
  invoices: Invoice[];
  
  // Actions
  addPatient: (data: Omit<Patient, 'id' | 'created_at'>) => Patient;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  
  addQueue: (patientId: string, complaint?: string) => QueueItem;
  updateQueueStatus: (queueId: string, status: QueueStatus) => void;
  
  saveMedicalRecord: (data: {
    queue_id: string;
    patient_id: string;
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
    action_fee?: number;
  }) => MedicalRecord;
  
  payInvoice: (invoiceId: string, method: PaymentMethod, paidAmount: number) => Invoice | null;
  
  // Master Data Obat
  addMedicine: (data: Omit<Medicine, 'id' | 'created_at'>) => Medicine;
  updateMedicine: (id: string, data: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;

  // Master Data Tarif
  addService: (data: Omit<MedicalService, 'id' | 'created_at'>) => MedicalService;
  updateService: (id: string, data: Partial<MedicalService>) => void;
  deleteService: (id: string) => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'clinic_emr_state_v1';

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('admin');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [queues, setQueues] = useState<QueueItem[]>(INITIAL_QUEUES);
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [services, setServices] = useState<MedicalService[]>(INITIAL_SERVICES);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(INITIAL_RECORDS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on client side mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.patients) setPatients(parsed.patients);
        if (parsed.queues) setQueues(parsed.queues);
        if (parsed.medicines) setMedicines(parsed.medicines);
        if (parsed.services) setServices(parsed.services);
        if (parsed.medicalRecords) setMedicalRecords(parsed.medicalRecords);
        if (parsed.invoices) setInvoices(parsed.invoices);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
        patients,
        queues,
        medicines,
        services,
        medicalRecords,
        invoices,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [patients, queues, medicines, services, medicalRecords, invoices, isLoaded]);

  // Actions
  const addPatient = (data: Omit<Patient, 'id' | 'created_at'>): Patient => {
    const newPatient: Patient = {
      ...data,
      id: `p-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  };

  const updatePatient = (id: string, data: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const addQueue = (patientId: string, complaint?: string): QueueItem => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayQueues = queues.filter((q) => q.queue_date === todayStr);
    const queueNumber = generateQueueNumber(todayQueues.length);
    const patientObj = patients.find((p) => p.id === patientId);

    const newQueue: QueueItem = {
      id: `q-${Date.now()}`,
      queue_number: queueNumber,
      patient_id: patientId,
      patient: patientObj,
      queue_date: todayStr,
      status: 'menunggu',
      complaint: complaint || 'Konsultasi & Pemeriksaan Umum',
      created_at: new Date().toISOString(),
    };

    setQueues((prev) => [...prev, newQueue]);
    return newQueue;
  };

  const updateQueueStatus = (queueId: string, status: QueueStatus) => {
    setQueues((prev) =>
      prev.map((q) => (q.id === queueId ? { ...q, status } : q))
    );
  };

  const saveMedicalRecord = (data: {
    queue_id: string;
    patient_id: string;
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
    action_fee?: number;
  }): MedicalRecord => {
    const recordId = `mr-${Date.now()}`;
    const patientObj = patients.find((p) => p.id === data.patient_id);
    
    const newRecord: MedicalRecord = {
      id: recordId,
      queue_id: data.queue_id,
      patient_id: data.patient_id,
      patient: patientObj,
      doctor_name: data.doctor_name,
      systolic: data.systolic,
      diastolic: data.diastolic,
      temperature: data.temperature,
      weight: data.weight,
      height: data.height,
      heart_rate: data.heart_rate,
      anamnesis: data.anamnesis,
      diagnosis: data.diagnosis,
      doctor_notes: data.doctor_notes,
      prescriptions: data.prescriptions,
      created_at: new Date().toISOString(),
    };

    setMedicalRecords((prev) => [newRecord, ...prev]);

    // 1. Update queue status to 'kasir'
    updateQueueStatus(data.queue_id, 'kasir');

    // 2. Calculate invoice amounts
    const consultationFee = 50000; // Standard doctor consultation fee
    const actionFee = data.action_fee || 0;
    const medicineFee = data.prescriptions.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
    const totalAmount = consultationFee + actionFee + medicineFee;

    const invoiceNumber = generateInvoiceNumber(invoices.length + 1);

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoice_number: invoiceNumber,
      queue_id: data.queue_id,
      patient_id: data.patient_id,
      patient: patientObj,
      medical_record_id: recordId,
      medical_record: newRecord,
      consultation_fee: consultationFee,
      action_fee: actionFee,
      medicine_fee: medicineFee,
      total_amount: totalAmount,
      paid_amount: 0,
      change_amount: 0,
      payment_method: 'cash',
      payment_status: 'unpaid',
      created_at: new Date().toISOString(),
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    return newRecord;
  };

  const payInvoice = (
    invoiceId: string,
    method: PaymentMethod,
    paidAmount: number
  ): Invoice | null => {
    const targetInvoice = invoices.find((i) => i.id === invoiceId);
    if (!targetInvoice) return null;

    const changeAmount = Math.max(0, paidAmount - targetInvoice.total_amount);
    const paidAt = new Date().toISOString();

    const updatedInvoice: Invoice = {
      ...targetInvoice,
      payment_method: method,
      payment_status: 'paid',
      paid_amount: paidAmount,
      change_amount: changeAmount,
      paid_at: paidAt,
    };

    // Update invoice status
    setInvoices((prev) =>
      prev.map((i) => (i.id === invoiceId ? updatedInvoice : i))
    );

    // Update associated queue status to 'selesai'
    if (targetInvoice.queue_id) {
      updateQueueStatus(targetInvoice.queue_id, 'selesai');
    }

    // AUTOMATIC STOCK DEDUCTION for prescribed medicines
    if (targetInvoice.medical_record && targetInvoice.medical_record.prescriptions) {
      setMedicines((prevMedicines) => {
        const copy = [...prevMedicines];
        targetInvoice.medical_record!.prescriptions.forEach((item) => {
          const medIndex = copy.findIndex((m) => m.id === item.medicine_id);
          if (medIndex !== -1) {
            copy[medIndex] = {
              ...copy[medIndex],
              stock: Math.max(0, copy[medIndex].stock - item.quantity),
            };
          }
        });
        return copy;
      });
    }

    return updatedInvoice;
  };

  // Master Data Obat CRUD
  const addMedicine = (data: Omit<Medicine, 'id' | 'created_at'>): Medicine => {
    const newMed: Medicine = {
      ...data,
      id: `m-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setMedicines((prev) => [...prev, newMed]);
    return newMed;
  };

  const updateMedicine = (id: string, data: Partial<Medicine>) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...data } : m))
    );
  };

  const deleteMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  // Master Data Tarif CRUD
  const addService = (data: Omit<MedicalService, 'id' | 'created_at'>): MedicalService => {
    const newServ: MedicalService = {
      ...data,
      id: `s-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setServices((prev) => [...prev, newServ]);
    return newServ;
  };

  const updateService = (id: string, data: Partial<MedicalService>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <ClinicContext.Provider
      value={{
        role,
        setRole,
        patients,
        queues,
        medicines,
        services,
        medicalRecords,
        invoices,
        addPatient,
        updatePatient,
        addQueue,
        updateQueueStatus,
        saveMedicalRecord,
        payInvoice,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addService,
        updateService,
        deleteService,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
