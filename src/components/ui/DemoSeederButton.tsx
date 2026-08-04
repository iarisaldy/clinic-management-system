'use client';

import React, { useState } from 'react';
import { RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  INITIAL_PATIENTS,
  INITIAL_MEDICINES,
  INITIAL_SERVICES,
  INITIAL_QUEUES,
  INITIAL_RECORDS,
  INITIAL_INVOICES,
  INITIAL_HEALTH_CERTIFICATES,
  INITIAL_REFERRAL_LETTERS,
  INITIAL_SICK_LEAVE_CERTIFICATES,
  INITIAL_DOCTOR_PROFILE
} from '@/lib/store/clinic-store';

const LOCAL_STORAGE_KEY = 'clinic_emr_state_v2';

export const DemoSeederButton: React.FC = () => {
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const handleSeedData = () => {
    if (!confirm('Apakah Anda yakin ingin memuat Ulang Sample Data Demo Klinik? Semua data transaksi saat ini akan diset ke status awal.')) {
      return;
    }

    setSeeding(true);
    try {
      const stateToSave = {
        patients: INITIAL_PATIENTS,
        queues: INITIAL_QUEUES,
        medicines: INITIAL_MEDICINES,
        services: INITIAL_SERVICES,
        medicalRecords: INITIAL_RECORDS,
        invoices: INITIAL_INVOICES,
        healthCertificates: INITIAL_HEALTH_CERTIFICATES,
        referralLetters: INITIAL_REFERRAL_LETTERS,
        sickLeaveCertificates: INITIAL_SICK_LEAVE_CERTIFICATES,
        doctorProfile: INITIAL_DOCTOR_PROFILE,
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
      setSeeded(true);

      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (e) {
      console.error('Failed to seed demo data', e);
      alert('Gagal memuat sample data.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <button
      onClick={handleSeedData}
      disabled={seeding}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-700 hover:bg-teal-100 rounded-xl transition-all duration-200 shadow-sm active:scale-95"
      title="Muat Ulang Sample Data Demo (Pasien, Antrean, EMR, Surat)"
    >
      {seeded ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
      ) : seeding ? (
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
      )}
      <span className="hidden sm:inline">⚡ Reset Demo Data</span>
    </button>
  );
};
