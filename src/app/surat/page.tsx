'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useClinic } from '@/lib/store/ClinicContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { formatTanggal, hitungUmur } from '@/lib/utils';
import { HealthCertificate, ReferralLetter, SickLeaveCertificate, Patient } from '@/lib/types/clinic';
import {
  FileCheck,
  Building2,
  Printer,
  Plus,
  Search,
  User,
  Activity,
  FileText,
  CheckCircle2,
  Calendar,
  Stethoscope,
  Clock,
  History,
  ShieldCheck,
  Sparkles,
  MapPin,
  Phone
} from 'lucide-react';

function SuratContent() {
  const searchParams = useSearchParams();
  const initialPatientId = searchParams.get('patientId') || '';
  const initialTab = searchParams.get('type') || 'sehat';

  const {
    patients,
    medicalRecords,
    healthCertificates,
    referralLetters,
    sickLeaveCertificates,
    doctorProfile,
    addHealthCertificate,
    addReferralLetter,
    addSickLeaveCertificate,
  } = useClinic();

  const [activeTab, setActiveTab] = useState<'sehat' | 'rujukan' | 'sakit' | 'riwayat'>(
    initialTab === 'rujukan' ? 'rujukan' : initialTab === 'sakit' ? 'sakit' : 'sehat'
  );

  // Selected Patient for generator
  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatientId);
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  // Latest Medical Record of selected patient for autofill
  const latestEMR = selectedPatient
    ? medicalRecords.find((mr) => mr.patient_id === selectedPatient.id)
    : null;

  // Print Preview Modal State
  const [printData, setPrintData] = useState<{
    type: 'sehat' | 'rujukan' | 'sakit';
    data: HealthCertificate | ReferralLetter | SickLeaveCertificate;
  } | null>(null);

  // --- FORM STATE: SURAT KETERANGAN SEHAT ---
  const [skLetterNum, setSkLetterNum] = useState(`00${healthCertificates.length + 1}/SK-SEHAT/VII/2026`);
  const [skOccupation, setSkOccupation] = useState('Karyawan Swasta');
  const [skPurpose, setSkPurpose] = useState('Persyaratan Melamar Pekerjaan');
  const [skHeight, setSkHeight] = useState(170);
  const [skWeight, setSkWeight] = useState(65);
  const [skBloodPressure, setSkBloodPressure] = useState('120/80 mmHg');
  const [skHeartRate, setSkHeartRate] = useState(78);
  const [skBloodType, setSkBloodType] = useState('O');
  const [skColorBlindness, setSkColorBlindness] = useState<'Tidak' | 'Parsial' | 'Ya'>('Tidak');
  const [skHealthStatus, setSkHealthStatus] = useState<'SEHAT' | 'TIDAK SEHAT'>('SEHAT');
  const [skDoctorNotes, setSkDoctorNotes] = useState('Kondisi fisik dan vital sign dalam keadaan sehat.');

  // --- FORM STATE: SURAT RUJUKAN RS ---
  const [srLetterNum, setSrLetterNum] = useState(`00${referralLetters.length + 1}/SR-RS/VII/2026`);
  const [srHospital, setSrHospital] = useState('RSUD dr. Hasan Sadikin Bandung');
  const [srDepartment, setSrDepartment] = useState('Poli Penyakit Dalam (Sp.PD)');
  const [srDiagnosis, setSrDiagnosis] = useState('');
  const [srAnamnesis, setSrAnamnesis] = useState('');
  const [srVitalSigns, setSrVitalSigns] = useState('TD: 120/80 mmHg, Nadi: 80x/mnt, Suhu: 36.5°C');
  const [srTreatment, setSrTreatment] = useState('Terapi simptomatis awal telah diberikan.');
  const [srReason, setSrReason] = useState('Evaluasi spesialis & penanganan medis lebih lanjut.');

  // --- FORM STATE: SURAT KETERANGAN SAKIT ---
  const [ssLetterNum, setSsLetterNum] = useState(`00${sickLeaveCertificates.length + 1}/SK-SAKIT/VII/2026`);
  const [ssDays, setSsDays] = useState(3);
  const [ssStartDate, setSsStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [ssEndDate, setSsEndDate] = useState(
    new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)
  );
  const [ssDiagnosis, setSsDiagnosis] = useState('');

  // Autofill data when selected patient or EMR changes
  useEffect(() => {
    if (selectedPatient) {
      if (latestEMR) {
        // Fill Vitals for Health Cert
        if (latestEMR.height) setSkHeight(latestEMR.height);
        if (latestEMR.weight) setSkWeight(latestEMR.weight);
        if (latestEMR.systolic && latestEMR.diastolic) {
          setSkBloodPressure(`${latestEMR.systolic}/${latestEMR.diastolic} mmHg`);
        }
        if (latestEMR.heart_rate) setSkHeartRate(latestEMR.heart_rate);

        // Fill Referral info
        setSrDiagnosis(latestEMR.diagnosis || '');
        setSrAnamnesis(latestEMR.anamnesis || '');
        setSrVitalSigns(
          `TD: ${latestEMR.systolic || 120}/${latestEMR.diastolic || 80} mmHg, Nadi: ${
            latestEMR.heart_rate || 80
          }x/mnt, Suhu: ${latestEMR.temperature || 36.5}°C, BB: ${latestEMR.weight || 65}kg`
        );
        if (latestEMR.prescriptions && latestEMR.prescriptions.length > 0) {
          const medsStr = latestEMR.prescriptions
            .map((p) => `${p.medicine_name} (${p.instruction})`)
            .join(', ');
          setSrTreatment(`Obat: ${medsStr}`);
        }

        // Fill Sick leave diagnosis
        setSsDiagnosis(latestEMR.diagnosis || '');
      }
    }
  }, [selectedPatientId, selectedPatient, latestEMR]);

  // Submit Handlers
  const handleGenerateSehat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      alert('Silakan pilih pasien terlebih dahulu.');
      return;
    }
    const newCert = addHealthCertificate({
      letter_number: skLetterNum,
      patient_id: selectedPatientId,
      occupation: skOccupation,
      purpose: skPurpose,
      height: Number(skHeight),
      weight: Number(skWeight),
      blood_pressure: skBloodPressure,
      heart_rate: Number(skHeartRate),
      blood_type: skBloodType,
      color_blindness: skColorBlindness,
      health_status: skHealthStatus,
      doctor_notes: skDoctorNotes,
      doctor_name: 'dr. Hendra Pratama',
    });

    setPrintData({ type: 'sehat', data: newCert });
  };

  const handleGenerateRujukan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      alert('Silakan pilih pasien terlebih dahulu.');
      return;
    }
    if (!srHospital || !srDepartment || !srDiagnosis) {
      alert('Mohon lengkapi Nama Rumah Sakit, Poli Tujuan, dan Diagnosis Rujukan.');
      return;
    }

    const newRef = addReferralLetter({
      letter_number: srLetterNum,
      patient_id: selectedPatientId,
      hospital_name: srHospital,
      department_name: srDepartment,
      diagnosis: srDiagnosis,
      anamnesis_summary: srAnamnesis,
      vital_signs_summary: srVitalSigns,
      treatment_given: srTreatment,
      referral_reason: srReason,
      doctor_name: 'dr. Hendra Pratama',
    });

    setPrintData({ type: 'rujukan', data: newRef });
  };

  const handleGenerateSakit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      alert('Silakan pilih pasien terlebih dahulu.');
      return;
    }

    const newSick = addSickLeaveCertificate({
      letter_number: ssLetterNum,
      patient_id: selectedPatientId,
      leave_days: Number(ssDays),
      start_date: ssStartDate,
      end_date: ssEndDate,
      diagnosis: ssDiagnosis || 'Demam dan Butuh Istirahat Medis',
      doctor_name: 'dr. Hendra Pratama',
    });

    setPrintData({ type: 'sakit', data: newSick });
  };

  const triggerBrowserPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-teal-600" /> Modul Cetak Surat Kesehatan & Rujukan RS
            </h1>
            <span className="bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
              Dokter Praktik Mandiri
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penerbitan resmi Surat Keterangan Sehat, Surat Rujukan Ke Rumah Sakit, dan Surat Keterangan Sakit pasien.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 overflow-x-auto max-w-full shrink-0">
          <button
            onClick={() => setActiveTab('sehat')}
            className={`px-3 sm:px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'sehat'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" /> Surat Sehat
          </button>
          <button
            onClick={() => setActiveTab('rujukan')}
            className={`px-3 sm:px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'rujukan'
                ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" /> Rujukan RS
          </button>
          <button
            onClick={() => setActiveTab('sakit')}
            className={`px-3 sm:px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'sakit'
                ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" /> Surat Sakit
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`px-3 sm:px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'riwayat'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" /> Riwayat Surat
          </button>
        </div>
      </div>

      {/* TAB 1: SURAT KETERANGAN SEHAT */}
      {activeTab === 'sehat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Patient Select & Profile (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600" /> Pilih Pasien Tujuan
                </CardTitle>
                <CardDescription>Pilih pasien terdaftar dari database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Pilih Pasien"
                  options={[
                    { value: '', label: '-- Pilih Pasien --' },
                    ...patients.map((p) => ({
                      value: p.id,
                      label: `${p.name} (NIK: ${p.nik})`,
                    })),
                  ]}
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                />

                {selectedPatient ? (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {selectedPatient.name}
                      </span>
                      <Badge variant="outline">
                        {selectedPatient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </Badge>
                    </div>
                    <p className="text-slate-500">NIK: {selectedPatient.nik}</p>
                    <p className="text-slate-500">
                      Umur: {hitungUmur(selectedPatient.dob)} Thn ({formatTanggal(selectedPatient.dob)})
                    </p>
                    <p className="text-slate-500 truncate">Alamat: {selectedPatient.address}</p>

                    {latestEMR && (
                      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                        ✓ Data vital sign otomatis diimpor dari EMR terakhir ({formatTanggal(latestEMR.created_at)})
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">
                    Silakan pilih pasien di atas untuk mulai mengisi data surat.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Certificate Form (8 cols) */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader className="bg-slate-50/60 dark:bg-slate-900/60">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-teal-600" /> Form Surat Keterangan Sehat
                </CardTitle>
                <CardDescription>
                  Lengkapi parameter fisik, keperluan, dan pernyataan kelayakan sehat pasien.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleGenerateSehat} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Nomor Surat Resmi"
                      value={skLetterNum}
                      onChange={(e) => setSkLetterNum(e.target.value)}
                      required
                    />
                    <Input
                      label="Pekerjaan Pasien"
                      placeholder="e.g. Karyawan Swasta, Mahasiswa, PNS"
                      value={skOccupation}
                      onChange={(e) => setSkOccupation(e.target.value)}
                      required
                    />
                  </div>

                  <Input
                    label="Keperluan Permohonan Surat"
                    placeholder="e.g. Syarat Melamar Pekerjaan, Persyaratan Sekolah/Kuliah, Perpanjangan SIM"
                    value={skPurpose}
                    onChange={(e) => setSkPurpose(e.target.value)}
                    required
                  />

                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-teal-600" /> Hasil Pemeriksaan Fisik
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Input
                        label="Tinggi Badan (cm)"
                        type="number"
                        value={skHeight}
                        onChange={(e) => setSkHeight(Number(e.target.value))}
                        required
                      />
                      <Input
                        label="Berat Badan (kg)"
                        type="number"
                        value={skWeight}
                        onChange={(e) => setSkWeight(Number(e.target.value))}
                        required
                      />
                      <Input
                        label="Tekanan Darah"
                        placeholder="120/80 mmHg"
                        value={skBloodPressure}
                        onChange={(e) => setSkBloodPressure(e.target.value)}
                        required
                      />
                      <Input
                        label="Denyut Nadi (bpm)"
                        type="number"
                        value={skHeartRate}
                        onChange={(e) => setSkHeartRate(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Select
                      label="Golongan Darah"
                      options={[
                        { value: 'O', label: 'Golongan Darah O' },
                        { value: 'A', label: 'Golongan Darah A' },
                        { value: 'B', label: 'Golongan Darah B' },
                        { value: 'AB', label: 'Golongan Darah AB' },
                        { value: '-', label: 'Tidak Diketahui (-)' },
                      ]}
                      value={skBloodType}
                      onChange={(e) => setSkBloodType(e.target.value)}
                    />

                    <Select
                      label="Pemeriksaan Buta Warna"
                      options={[
                        { value: 'Tidak', label: 'Tidak Buta Warna (Normal)' },
                        { value: 'Parsial', label: 'Buta Warna Parsial' },
                        { value: 'Ya', label: 'Buta Warna Total' },
                      ]}
                      value={skColorBlindness}
                      onChange={(e) => setSkColorBlindness(e.target.value as any)}
                    />

                    <Select
                      label="Kesimpulan Kesehatan"
                      options={[
                        { value: 'SEHAT', label: 'Dinyatakan SEHAT (Layak)' },
                        { value: 'TIDAK SEHAT', label: 'Dinyatakan TIDAK SEHAT' },
                      ]}
                      value={skHealthStatus}
                      onChange={(e) => setSkHealthStatus(e.target.value as any)}
                    />
                  </div>

                  <Input
                    label="Catatan / Saran Dokter (Opsional)"
                    placeholder="e.g. Fisik dan vital sign dalam batas normal."
                    value={skDoctorNotes}
                    onChange={(e) => setSkDoctorNotes(e.target.value)}
                  />

                  <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
                    <Button variant="primary" size="lg" type="submit">
                      <Printer className="w-5 h-5" /> Buat & Pratinjau Cetak Surat Sehat
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: SURAT RUJUKAN KE RUMAH SAKIT */}
      {activeTab === 'rujukan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Patient Selector & EMR Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" /> Pilih Pasien Rujukan
                </CardTitle>
                <CardDescription>Pilih pasien yang memerlukan rujukan spesialis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Pilih Pasien"
                  options={[
                    { value: '', label: '-- Pilih Pasien --' },
                    ...patients.map((p) => ({
                      value: p.id,
                      label: `${p.name} (NIK: ${p.nik})`,
                    })),
                  ]}
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                />

                {selectedPatient ? (
                  <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {selectedPatient.name}
                      </span>
                      <Badge variant="secondary">Rujukan RS</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">NIK: {selectedPatient.nik}</p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Umur: {hitungUmur(selectedPatient.dob)} Thn ({selectedPatient.gender === 'L' ? 'Pria' : 'Wanita'})
                    </p>

                    {latestEMR && (
                      <div className="mt-3 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-blue-100 dark:border-blue-900 space-y-1 text-[11px]">
                        <p className="font-bold text-blue-700 dark:text-blue-400">
                          Riwayat EMR Terakhir ({formatTanggal(latestEMR.created_at)}):
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">
                          <span className="font-semibold">Diagnosis:</span> {latestEMR.diagnosis}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400">
                          <span className="font-semibold">Anamnesis:</span> {latestEMR.anamnesis}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">
                    Silakan pilih pasien di atas untuk mengisi data rujukan.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Referral Form (8 cols) */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader className="bg-slate-50/60 dark:bg-slate-900/60">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" /> Form Surat Rujukan Ke Rumah Sakit
                </CardTitle>
                <CardDescription>
                  Tentukan RS Tujuan, Poli Spesialis, Ringkasan Diagnosis, dan Alasan Rujukan Medis.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleGenerateRujukan} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Nomor Surat Rujukan"
                      value={srLetterNum}
                      onChange={(e) => setSrLetterNum(e.target.value)}
                      required
                    />
                    <Input
                      label="Nama Rumah Sakit Tujuan"
                      placeholder="e.g. RSUD dr. Hasan Sadikin, RS Hermina, RS Siloam"
                      value={srHospital}
                      onChange={(e) => setSrHospital(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Poli / Dokter Spesialis Tujuan"
                      placeholder="e.g. Poli Penyakit Dalam (Sp.PD), Poli Bedah (Sp.B), Poli Saraf"
                      value={srDepartment}
                      onChange={(e) => setSrDepartment(e.target.value)}
                      required
                    />
                    <Input
                      label="Diagnosis Sementara / Kerja"
                      placeholder="e.g. E11 - Type 2 Diabetes Mellitus dengan Komplikasi"
                      value={srDiagnosis}
                      onChange={(e) => setSrDiagnosis(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Ringkasan Anamnesis / Keluhan Medis
                    </label>
                    <textarea
                      rows={2}
                      className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      placeholder="Catat keluhan utama dan kondisi pasien..."
                      value={srAnamnesis}
                      onChange={(e) => setSrAnamnesis(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Ringkasan Tanda Vital & Fisik"
                      value={srVitalSigns}
                      onChange={(e) => setSrVitalSigns(e.target.value)}
                      required
                    />
                    <Input
                      label="Terapi / Obat yang Sudah Diberikan"
                      value={srTreatment}
                      onChange={(e) => setSrTreatment(e.target.value)}
                      required
                    />
                  </div>

                  <Input
                    label="Alasan Rujukan Medis"
                    placeholder="e.g. Evaluasi Spesialis, Penanganan Medis Lebih Lanjut, Pemeriksaan Penunjang Lab/Radiologi"
                    value={srReason}
                    onChange={(e) => setSrReason(e.target.value)}
                    required
                  />

                  <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
                    <Button variant="primary" size="lg" type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Printer className="w-5 h-5" /> Buat & Pratinjau Cetak Surat Rujukan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: SURAT KETERANGAN SAKIT */}
      {activeTab === 'sakit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" /> Pilih Pasien
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Pilih Pasien"
                  options={[
                    { value: '', label: '-- Pilih Pasien --' },
                    ...patients.map((p) => ({
                      value: p.id,
                      label: `${p.name} (NIK: ${p.nik})`,
                    })),
                  ]}
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                />

                {selectedPatient && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 text-xs space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">{selectedPatient.name}</p>
                    <p className="text-slate-500">NIK: {selectedPatient.nik}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card>
              <CardHeader className="bg-slate-50/60 dark:bg-slate-900/60">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" /> Form Surat Keterangan Sakit (Istirahat)
                </CardTitle>
                <CardDescription>Surat keterangan perlunya istirahat berobat karena sakit.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleGenerateSakit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Nomor Surat Sakit"
                      value={ssLetterNum}
                      onChange={(e) => setSsLetterNum(e.target.value)}
                      required
                    />
                    <Input
                      label="Jumlah Hari Istirahat"
                      type="number"
                      min={1}
                      value={ssDays}
                      onChange={(e) => setSsDays(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Mulai Tanggal"
                      type="date"
                      value={ssStartDate}
                      onChange={(e) => setSsStartDate(e.target.value)}
                      required
                    />
                    <Input
                      label="Sampai Tanggal"
                      type="date"
                      value={ssEndDate}
                      onChange={(e) => setSsEndDate(e.target.value)}
                      required
                    />
                  </div>

                  <Input
                    label="Diagnosis / Keluhan Ringkas"
                    placeholder="e.g. J00 - Acute Nasopharyngitis (Fever & Flu)"
                    value={ssDiagnosis}
                    onChange={(e) => setSsDiagnosis(e.target.value)}
                    required
                  />

                  <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
                    <Button variant="primary" size="lg" type="submit" className="bg-purple-600 hover:bg-purple-700">
                      <Printer className="w-5 h-5" /> Buat & Pratinjau Cetak Surat Sakit
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 4: RIWAYAT SURAT TERBIT */}
      {activeTab === 'riwayat' && (
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Rekapitulasi Surat Terbit</CardTitle>
            <CardDescription>
              Daftar seluruh Surat Sehat, Surat Rujukan RS, dan Surat Sakit yang telah diterbitkan.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Health Certificates */}
              {healthCertificates.map((cert) => (
                <div key={cert.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          Surat Keterangan Sehat ({cert.letter_number})
                        </h4>
                        <Badge variant="emerald">{cert.health_status}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pasien: <span className="font-semibold text-slate-700 dark:text-slate-300">{cert.patient?.name || cert.patient_id}</span> • Keperluan: {cert.purpose}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{formatTanggal(cert.created_at)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPrintData({ type: 'sehat', data: cert })}
                    >
                      <Printer className="w-3.5 h-3.5" /> Cetak Ulang
                    </Button>
                  </div>
                </div>
              ))}

              {/* Referral Letters */}
              {referralLetters.map((ref) => (
                <div key={ref.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          Surat Rujukan RS ({ref.letter_number})
                        </h4>
                        <Badge variant="blue">Rujukan RS</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pasien: <span className="font-semibold text-slate-700 dark:text-slate-300">{ref.patient?.name || ref.patient_id}</span> • Ke: <span className="font-medium text-blue-600">{ref.hospital_name}</span> ({ref.department_name})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{formatTanggal(ref.created_at)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPrintData({ type: 'rujukan', data: ref })}
                    >
                      <Printer className="w-3.5 h-3.5" /> Cetak Ulang
                    </Button>
                  </div>
                </div>
              ))}

              {/* Sick Leave Certificates */}
              {sickLeaveCertificates.map((sick) => (
                <div key={sick.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          Surat Sakit / Istirahat ({sick.letter_number})
                        </h4>
                        <Badge variant="purple">{sick.leave_days} Hari Istirahat</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pasien: <span className="font-semibold text-slate-700 dark:text-slate-300">{sick.patient?.name || sick.patient_id}</span> • Diagnosis: {sick.diagnosis}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{formatTanggal(sick.created_at)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPrintData({ type: 'sakit', data: sick })}
                    >
                      <Printer className="w-3.5 h-3.5" /> Cetak Ulang
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PRINT PREVIEW MODAL & PRINTABLE DOCUMENT */}
      {printData && (
        <Modal
          isOpen={!!printData}
          onClose={() => setPrintData(null)}
          title={
            printData.type === 'sehat'
              ? 'Pratinjau Cetak Surat Keterangan Sehat'
              : printData.type === 'rujukan'
              ? 'Pratinjau Cetak Surat Rujukan Rumah Sakit'
              : 'Pratinjau Cetak Surat Keterangan Sakit'
          }
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Printable Document Container */}
            <div id="printable-letter-container" className="bg-white text-slate-900 p-8 rounded-xl border border-slate-300 shadow-inner font-sans text-xs space-y-6">
              {/* KOP SURAT PRAKTIK DOKTER MANDIRI */}
              <div className="border-b-2 border-slate-900 pb-4 text-center">
                <h2 className="text-lg font-black tracking-wide uppercase text-slate-900">
                  {doctorProfile.clinic_name || 'PRAKTIK DOKTER MANDIRI'}
                </h2>
                <h3 className="text-base font-bold text-teal-800">
                  {doctorProfile.name}
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  SIP No: {doctorProfile.sip} • STR No: {doctorProfile.str}
                </p>
                <p className="text-[11px] text-slate-600">
                  Alamat Praktik: {doctorProfile.address}, {doctorProfile.city} • Telp: {doctorProfile.phone}
                </p>
              </div>

              {/* DOCUMENT HEADER TYPE */}
              {printData.type === 'sehat' && (
                <>
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-black underline uppercase tracking-wider text-slate-900">
                      SURAT KETERANGAN SEHAT
                    </h3>
                    <p className="text-xs font-semibold text-slate-700">
                      Nomor: {(printData.data as HealthCertificate).letter_number}
                    </p>
                  </div>

                  <p className="leading-relaxed">
                    Yang bertanda tangan di bawah ini Dokter Praktik Mandiri menerangkan dengan sebenarnya bahwa:
                  </p>

                  <div className="pl-4 space-y-1.5 font-medium">
                    <div className="grid grid-cols-12">
                      <span className="col-span-4 font-semibold">Nama Lengkap</span>
                      <span className="col-span-8">: {(printData.data as HealthCertificate).patient?.name}</span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-4 font-semibold">NIK</span>
                      <span className="col-span-8">: {(printData.data as HealthCertificate).patient?.nik}</span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-4 font-semibold">Jenis Kelamin / Umur</span>
                      <span className="col-span-8">
                        : {(printData.data as HealthCertificate).patient?.gender === 'L' ? 'Laki-laki' : 'Perempuan'},{' '}
                        {hitungUmur((printData.data as HealthCertificate).patient?.dob || '')} Tahun
                      </span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-4 font-semibold">Pekerjaan</span>
                      <span className="col-span-8">: {(printData.data as HealthCertificate).occupation}</span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-4 font-semibold">Alamat</span>
                      <span className="col-span-8">: {(printData.data as HealthCertificate).patient?.address}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold">Berdasarkan hasil pemeriksaan fisik & kesehatan saat ini:</p>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                      <div>• Tinggi Badan: {(printData.data as HealthCertificate).height} cm</div>
                      <div>• Berat Badan: {(printData.data as HealthCertificate).weight} kg</div>
                      <div>• Tekanan Darah: {(printData.data as HealthCertificate).blood_pressure}</div>
                      <div>• Golongan Darah: {(printData.data as HealthCertificate).blood_type}</div>
                      <div>• Buta Warna: {(printData.data as HealthCertificate).color_blindness}</div>
                      <div>• Denyut Nadi: {(printData.data as HealthCertificate).heart_rate || 80} bpm</div>
                    </div>
                  </div>

                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-900 font-bold text-center">
                    Kesimpulan: Yang bersangkutan dinyatakan{' '}
                    <span className="underline text-teal-800 text-sm">
                      {(printData.data as HealthCertificate).health_status}
                    </span>{' '}
                    untuk keperluan: &quot;{(printData.data as HealthCertificate).purpose}&quot;.
                  </div>
                </>
              )}

              {printData.type === 'rujukan' && (
                <>
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-black underline uppercase tracking-wider text-slate-900">
                      SURAT RUJUKAN RUMAH SAKIT
                    </h3>
                    <p className="text-xs font-semibold text-slate-700">
                      Nomor: {(printData.data as ReferralLetter).letter_number}
                    </p>
                  </div>

                  <div className="flex justify-between items-start font-medium text-[11px]">
                    <div>
                      <p>Kepada Yth:</p>
                      <p className="font-bold text-slate-900">
                        Dokter Spesialis / Tim Medis {(printData.data as ReferralLetter).department_name}
                      </p>
                      <p className="font-bold text-slate-900">
                        {(printData.data as ReferralLetter).hospital_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>Bandung, {formatTanggal((printData.data as ReferralLetter).created_at)}</p>
                    </div>
                  </div>

                  <p className="leading-relaxed">
                    Mohon konsul dan penanganan medis lebih lanjut terhadap pasien di bawah ini:
                  </p>

                  <div className="pl-4 space-y-1 font-medium">
                    <div className="grid grid-cols-12">
                      <span className="col-span-4 font-semibold">Nama Pasien</span>
                      <span className="col-span-8">: {(printData.data as ReferralLetter).patient?.name}</span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-4 font-semibold">NIK / Umur</span>
                      <span className="col-span-8">
                        : {(printData.data as ReferralLetter).patient?.nik} ({hitungUmur((printData.data as ReferralLetter).patient?.dob || '')} Thn)
                      </span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-4 font-semibold">Alamat</span>
                      <span className="col-span-8">: {(printData.data as ReferralLetter).patient?.address}</span>
                    </div>
                  </div>

                  <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1.5">
                    <div>
                      <span className="font-bold text-slate-900">1. Diagnosis Sementara / Kerja:</span>
                      <p className="text-teal-700 font-semibold">{(printData.data as ReferralLetter).diagnosis}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">2. Ringkasan Anamnesis:</span>
                      <p className="text-slate-700">{(printData.data as ReferralLetter).anamnesis_summary}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">3. Tanda Vital & Pemeriksaan Fisik:</span>
                      <p className="text-slate-700">{(printData.data as ReferralLetter).vital_signs_summary}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">4. Terapi / Tindakan yang Telah Diberikan:</span>
                      <p className="text-slate-700">{(printData.data as ReferralLetter).treatment_given}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">5. Alasan Rujukan:</span>
                      <p className="text-slate-700">{(printData.data as ReferralLetter).referral_reason}</p>
                    </div>
                  </div>

                  <p className="leading-relaxed">
                    Demikian surat rujukan ini kami kirimkan. Atas kerja sama dan penanganan Teman Sejawat, kami ucapkan terima kasih.
                  </p>
                </>
              )}

              {printData.type === 'sakit' && (
                <>
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-black underline uppercase tracking-wider text-slate-900">
                      SURAT KETERANGAN SAKIT
                    </h3>
                    <p className="text-xs font-semibold text-slate-700">
                      Nomor: {(printData.data as SickLeaveCertificate).letter_number}
                    </p>
                  </div>

                  <p className="leading-relaxed">
                    Menerangkan bahwa pasien di bawah ini membutuhkan istirahat berobat karena kondisi kesehatan (sakit):
                  </p>

                  <div className="pl-4 space-y-1.5 font-medium">
                    <div className="grid grid-cols-12">
                      <span className="col-span-4 font-semibold">Nama Pasien</span>
                      <span className="col-span-8">: {(printData.data as SickLeaveCertificate).patient?.name}</span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-4 font-semibold">NIK / Umur</span>
                      <span className="col-span-8">
                        : {(printData.data as SickLeaveCertificate).patient?.nik} ({hitungUmur((printData.data as SickLeaveCertificate).patient?.dob || '')} Thn)
                      </span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-4 font-semibold">Diagnosis</span>
                      <span className="col-span-8">: {(printData.data as SickLeaveCertificate).diagnosis}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 font-bold text-center">
                    Perlu istirahat berobat selama{' '}
                    <span className="underline text-purple-800 text-sm">
                      {(printData.data as SickLeaveCertificate).leave_days} Hari
                    </span>{' '}
                    terhitung dari tanggal{' '}
                    <span>{formatTanggal((printData.data as SickLeaveCertificate).start_date)}</span> s/d{' '}
                    <span>{formatTanggal((printData.data as SickLeaveCertificate).end_date)}</span>.
                  </div>
                </>
              )}

              {/* FOOTER SIGNATURE BLOCK */}
              <div className="pt-6 flex justify-between items-end text-xs">
                <div className="text-[10px] text-slate-400">
                  <p>* Surat ini diterbitkan sah secara elektronik</p>
                  <p>* Dokumen Praktik Dokter Mandiri</p>
                </div>

                <div className="text-center space-y-12">
                  <div>
                    <p>{doctorProfile.city}, {formatTanggal(printData.data.created_at)}</p>
                    <p className="font-semibold text-slate-800">Dokter Pemeriksa,</p>
                  </div>

                  <div>
                    <p className="font-bold underline text-slate-900">{doctorProfile.name}</p>
                    <p className="text-[10px] text-slate-500">SIP: {doctorProfile.sip}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setPrintData(null)}>
                Tutup
              </Button>
              <Button variant="primary" onClick={triggerBrowserPrint}>
                <Printer className="w-4 h-4" /> Cetak Sekarang (Print / PDF)
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function SuratPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm">Memuat Modul Surat Dokter...</div>}>
      <SuratContent />
    </Suspense>
  );
}
