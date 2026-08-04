'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useClinic } from '@/lib/store/ClinicContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PrescriptionItem, Patient, QueueItem } from '@/lib/types/clinic';
import { formatRupiah, formatTanggal, hitungUmur } from '@/lib/utils';
import {
  Stethoscope,
  User,
  History,
  Activity,
  Plus,
  Trash2,
  Pill,
  Save,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Thermometer,
  Weight,
  Heart,
  Calendar,
  Phone,
  MapPin,
  Sparkles,
  RefreshCw
} from 'lucide-react';

function RekamMedisContent() {
  const searchParams = useSearchParams();
  const queueIdParam = searchParams.get('queueId');

  const {
    queues,
    patients,
    medicines,
    services,
    medicalRecords,
    saveMedicalRecord,
    updateQueueStatus
  } = useClinic();

  // Active queues for doctor examination
  const activeQueues = queues.filter((q) => q.status === 'pemeriksaan' || q.status === 'menunggu');

  // Selected queue
  const [selectedQueueId, setSelectedQueueId] = useState<string>('');

  useEffect(() => {
    if (queueIdParam && queues.some((q) => q.id === queueIdParam)) {
      setSelectedQueueId(queueIdParam);
    } else if (activeQueues.length > 0 && !selectedQueueId) {
      setSelectedQueueId(activeQueues[0].id);
    }
  }, [queueIdParam, queues, activeQueues]);

  const activeQueue = queues.find((q) => q.id === selectedQueueId);
  const activePatient = activeQueue ? patients.find((p) => p.id === activeQueue.patient_id) : null;

  // Past medical records for this patient
  const pastRecords = activePatient
    ? medicalRecords.filter((mr) => mr.patient_id === activePatient.id)
    : [];

  // Form State for Active Consultation
  const [vitals, setVitals] = useState({
    systolic: 120,
    diastolic: 80,
    temperature: 36.5,
    weight: 65,
    height: 165,
    heartRate: 80,
  });

  const [anamnesis, setAnamnesis] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [selectedActionId, setSelectedActionId] = useState<string>('');

  // Dynamic Prescriptions list
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [selectedMedId, setSelectedMedId] = useState('');
  const [medQty, setMedQty] = useState(1);
  const [medInstruction, setMedInstruction] = useState('3x1 Sesudah Makan');
  const [aiLoading, setAiLoading] = useState(false);

  const handleAISuggest = async () => {
    if (!anamnesis.trim()) {
      alert('Mohon isi Anamnesis / Keluhan Pasien terlebih dahulu.');
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'icd10_suggest',
          prompt: anamnesis,
          patientContext: {
            anamnesis,
            gender: activePatient?.gender,
          },
        }),
      });
      const data = await res.json();
      if (data.reply) {
        // Extract ICD-10 line or set main diagnosis
        const lines = data.reply.split('\n');
        const firstIcdLine = lines.find((l: string) => l.includes('1.') || l.includes('ICD')) || lines[0];
        const cleanIcd = firstIcdLine.replace(/^\d+\.\s*\*\*/, '').replace(/\*\*/g, '').trim();
        setDiagnosis(cleanIcd || 'J00 - Acute Nasopharyngitis');
      }
    } catch (e) {
      alert('Gagal mendapatkan rekomendasi AI.');
    } finally {
      setAiLoading(false);
    }
  };

  // Set initial anamnesis from queue complaint when selectedQueueId changes
  useEffect(() => {
    if (activeQueue) {
      setAnamnesis(activeQueue.complaint || '');
    }
  }, [selectedQueueId, activeQueue]);

  // Add medicine to prescription list
  const handleAddMedicine = () => {
    if (!selectedMedId) return;
    const medObj = medicines.find((m) => m.id === selectedMedId);
    if (!medObj) return;

    if (medQty > medObj.stock) {
      alert(`Stok obat ${medObj.name} hanya tersisa ${medObj.stock} ${medObj.unit}!`);
      return;
    }

    // Check if already in list
    const existingIndex = prescriptions.findIndex((p) => p.medicine_id === selectedMedId);
    if (existingIndex !== -1) {
      const updated = [...prescriptions];
      updated[existingIndex].quantity += medQty;
      setPrescriptions(updated);
    } else {
      setPrescriptions((prev) => [
        ...prev,
        {
          medicine_id: medObj.id,
          medicine_name: medObj.name,
          quantity: medQty,
          unit_price: medObj.sell_price,
          instruction: medInstruction,
        },
      ]);
    }

    // Reset prescription select
    setSelectedMedId('');
    setMedQty(1);
  };

  const handleRemovePrescription = (index: number) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitEMR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQueue || !activePatient) return;
    if (!anamnesis || !diagnosis) {
      alert('Mohon lengkapi Anamnesis dan Diagnosis pasien.');
      return;
    }

    const actionObj = services.find((s) => s.id === selectedActionId);
    const actionFee = actionObj ? actionObj.price : 0;

    saveMedicalRecord({
      queue_id: activeQueue.id,
      patient_id: activePatient.id,
      doctor_name: 'dr. Hendra Pratama',
      systolic: Number(vitals.systolic),
      diastolic: Number(vitals.diastolic),
      temperature: Number(vitals.temperature),
      weight: Number(vitals.weight),
      height: Number(vitals.height),
      heart_rate: Number(vitals.heartRate),
      anamnesis,
      diagnosis,
      doctor_notes: doctorNotes,
      prescriptions,
      action_fee: actionFee,
    });

    alert(`Rekam Medis untuk ${activePatient.name} berhasil disimpan! Pasien dikirim ke antrean Kasir.`);

    // Reset Form
    setAnamnesis('');
    setDiagnosis('');
    setDoctorNotes('');
    setPrescriptions([]);
    setSelectedActionId('');
  };

  // Quick Diagnosis Tags
  const quickDiagnosis = [
    'J00 - Acute Nasopharyngitis (Common Cold)',
    'K29.7 - Gastritis, Unspecified',
    'I10 - Essential Hypertension',
    'E11 - Type 2 Diabetes Mellitus',
    'R50.9 - Fever, Unspecified',
    'A09 - Infectious Gastroenteritis',
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar / Select Active Queue */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-teal-600" /> Ruang Rekam Medis (Doctor EMR)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih antrean pasien berjalan untuk mulai mengisi pemeriksaan medis.
          </p>
        </div>

        {/* Selector Queue */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
            Antrean Pasien:
          </label>
          <select
            className="px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={selectedQueueId}
            onChange={(e) => setSelectedQueueId(e.target.value)}
          >
            {activeQueues.length === 0 ? (
              <option value="">(Tidak ada antrean aktif)</option>
            ) : (
              activeQueues.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.queue_number} - {q.patient?.name} ({q.status.toUpperCase()})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {!activePatient ? (
        <Card className="p-12 text-center text-slate-500">
          <Stethoscope className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-base text-slate-700 dark:text-slate-200">
            Tidak ada pasien yang dipilih
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Silakan daftarkan atau panggil pasien ke kamar pemeriksaan melalui menu Pendaftaran.
          </p>
        </Card>
      ) : (
        /* SPLIT SCREEN LAYOUT: Sisi Kiri (Profil & Timeline) | Sisi Kanan (Form EMR) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SISI KIRI: Profil Pasien & Riwayat Medis (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Patient Demographic Card */}
            <Card className="border-t-4 border-t-teal-600">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 font-extrabold text-xl flex items-center justify-center border border-teal-500/20 shadow-inner">
                    {activePatient.gender === 'L' ? '👨' : '👩'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {activePatient.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {activePatient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}, {hitungUmur(activePatient.dob)} Tahun
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
                      NIK: {activePatient.nik}
                    </span>
                  </div>
                </div>

                {/* Patient Contacts & Allergy */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>{activePatient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span className="truncate">{activePatient.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>Tgl Lahir: {formatTanggal(activePatient.dob)}</span>
                  </div>

                  {activePatient.allergies && (
                    <div className="mt-3 p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">RIWAYAT ALERGI:</span>
                        <p className="font-medium">{activePatient.allergies}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Riwayat Kunjungan Lalu Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <History className="w-4 h-4 text-teal-600" /> Riwayat Kunjungan Lalu ({pastRecords.length})
                </CardTitle>
                <CardDescription>Rekam medis terdahulu di klinik ini</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {pastRecords.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    Belum ada riwayat rekam medis terdahulu.
                  </p>
                ) : (
                  pastRecords.map((mr) => (
                    <div
                      key={mr.id}
                      className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {formatTanggal(mr.created_at)}
                        </span>
                        <span className="text-[10px] text-slate-400">{mr.doctor_name}</span>
                      </div>

                      <p className="font-bold text-slate-900 dark:text-white">
                        Dx: <span className="text-teal-600 dark:text-teal-400">{mr.diagnosis}</span>
                      </p>

                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                        Keluhan: {mr.anamnesis}
                      </p>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                        <span>Tensi: {mr.systolic}/{mr.diastolic} mmHg</span>
                        <span>• BB: {mr.weight} kg</span>
                        <span>• Suhu: {mr.temperature}°C</span>
                      </div>

                      {mr.prescriptions.length > 0 && (
                        <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                          <span className="font-semibold text-slate-600">Resep:</span>
                          <ul className="list-disc list-inside text-slate-500">
                            {mr.prescriptions.map((p, idx) => (
                              <li key={idx}>
                                {p.medicine_name} ({p.quantity} x - {p.instruction})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* SISI KANAN: Form Input Rekam Medis Aktif (8 cols) */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" /> Form Pemeriksaan & Input EMR Dokter
                </CardTitle>
                <CardDescription>
                  Isi tanda vital, anamnesis, diagnosis ICD-10, dan resep obat pasien saat ini.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSubmitEMR} className="space-y-6">
                  {/* 1. VITAL SIGNS GRID */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-teal-600" /> 1. Tanda-Tanda Vital (TTV)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      <Input
                        label="Systolic (mmHg)"
                        type="number"
                        value={vitals.systolic}
                        onChange={(e) => setVitals({ ...vitals, systolic: Number(e.target.value) })}
                      />
                      <Input
                        label="Diastolic (mmHg)"
                        type="number"
                        value={vitals.diastolic}
                        onChange={(e) => setVitals({ ...vitals, diastolic: Number(e.target.value) })}
                      />
                      <Input
                        label="Suhu (°C)"
                        type="number"
                        step="0.1"
                        value={vitals.temperature}
                        onChange={(e) => setVitals({ ...vitals, temperature: Number(e.target.value) })}
                      />
                      <Input
                        label="Berat (kg)"
                        type="number"
                        step="0.1"
                        value={vitals.weight}
                        onChange={(e) => setVitals({ ...vitals, weight: Number(e.target.value) })}
                      />
                      <Input
                        label="Tinggi (cm)"
                        type="number"
                        value={vitals.height}
                        onChange={(e) => setVitals({ ...vitals, height: Number(e.target.value) })}
                      />
                      <Input
                        label="Nadi (bpm)"
                        type="number"
                        value={vitals.heartRate}
                        onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* 2. ANAMNESIS & DIAGNOSIS */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-teal-600" /> 2. Anamnesis & Diagnosis
                    </h4>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Anamnesis / Keluhan Utama Pasien
                      </label>
                      <textarea
                        rows={3}
                        required
                        className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        placeholder="Catat keluhan utama, riwayat penyakit sekarang, dan pemeriksaan fisik..."
                        value={anamnesis}
                        onChange={(e) => setAnamnesis(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Diagnosis (ICD-10 / Text Free)
                        </label>
                        <button
                          type="button"
                          onClick={handleAISuggest}
                          disabled={aiLoading}
                          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700 hover:bg-teal-100 rounded-lg transition-colors shadow-sm"
                        >
                          {aiLoading ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                          )}
                          <span>✨ AI Suggest ICD-10</span>
                        </button>
                      </div>

                      <Input
                        placeholder="Contoh: J00 - Acute Nasopharyngitis"
                        required
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                      />
                      {/* Quick diagnosis chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-semibold self-center mr-1">Rekomendasi Quick Tags:</span>
                        {quickDiagnosis.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setDiagnosis(tag)}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-700 transition-colors border border-slate-200/60 dark:border-slate-700/60"
                          >
                            + {tag.split('-')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* 3. DYNAMIC PRESCRIPTION TABLE */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Pill className="w-4 h-4 text-teal-600" /> 3. Input Resep Obat Dinamis
                      </h4>
                      <span className="text-xs font-semibold text-slate-500">
                        {prescriptions.length} jenis obat dipilih
                      </span>
                    </div>

                    {/* Prescription input row */}
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Pilih Obat (Master Data)
                        </label>
                        <select
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                          value={selectedMedId}
                          onChange={(e) => setSelectedMedId(e.target.value)}
                        >
                          <option value="">-- Pilih Obat --</option>
                          {medicines.map((m) => (
                            <option key={m.id} value={m.id} disabled={m.stock <= 0}>
                              {m.name} (Stok: {m.stock} {m.unit}) - {formatRupiah(m.sell_price)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <Input
                          label="Jumlah (Qty)"
                          type="number"
                          min={1}
                          value={medQty}
                          onChange={(e) => setMedQty(Math.max(1, Number(e.target.value)))}
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <Input
                          label="Aturan Pakai"
                          placeholder="3x1 Sesudah Makan"
                          value={medInstruction}
                          onChange={(e) => setMedInstruction(e.target.value)}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="w-full"
                          onClick={handleAddMedicine}
                        >
                          <Plus className="w-4 h-4" /> Tambah
                        </Button>
                      </div>
                    </div>

                    {/* Prescriptions Table */}
                    {prescriptions.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-3 italic">
                        Belum ada obat yang dimasukkan ke resep.
                      </p>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                            <tr>
                              <th className="p-3">Nama Obat</th>
                              <th className="p-3">Harga Satuan</th>
                              <th className="p-3 text-center">Jumlah</th>
                              <th className="p-3">Aturan Pakai</th>
                              <th className="p-3 text-right">Subtotal</th>
                              <th className="p-3 text-center">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {prescriptions.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                <td className="p-3 font-bold text-slate-900 dark:text-white">
                                  {item.medicine_name}
                                </td>
                                <td className="p-3 text-slate-600">{formatRupiah(item.unit_price)}</td>
                                <td className="p-3 text-center font-bold">{item.quantity}</td>
                                <td className="p-3 text-teal-600 font-medium">{item.instruction}</td>
                                <td className="p-3 text-right font-semibold">
                                  {formatRupiah(item.unit_price * item.quantity)}
                                </td>
                                <td className="p-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePrescription(idx)}
                                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* 4. TINDAKAN TAMBAHAN & CATATAN DOKTER */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Tindakan / Prosedur Tambahan (Opsional)"
                      options={[
                        { value: '', label: 'Tanpa Tindakan Tambahan' },
                        ...services.map((s) => ({
                          value: s.id,
                          label: `${s.name} (${formatRupiah(s.price)})`,
                        })),
                      ]}
                      value={selectedActionId}
                      onChange={(e) => setSelectedActionId(e.target.value)}
                    />

                    <Input
                      label="Catatan Dokter / Edukasi Pasien"
                      placeholder="Contoh: Kurangi konsumsi es, kontrol 3 hari lagi jika tidak membaik..."
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                    />
                  </div>

                  {/* QUICK CERTIFICATE SHORTCUTS FOR ACTIVE PATIENT */}
                  {activePatient && (
                    <div className="p-3.5 bg-teal-50/60 dark:bg-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-teal-800 dark:text-teal-300">Cetak Surat Pasien Ini:</span>
                        <p className="text-slate-500">Cetak Surat Sehat atau Surat Rujukan RS secara instant untuk {activePatient.name}.</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`/surat?patientId=${activePatient.id}&type=sehat`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg font-semibold bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 hover:bg-teal-100 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                        >
                          📜 Surat Sehat
                        </a>
                        <a
                          href={`/surat?patientId=${activePatient.id}&type=rujukan`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg font-semibold bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                        >
                          🏥 Rujukan RS
                        </a>
                      </div>
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-500">
                      Status antrean otomatis diperbarui ke <span className="font-bold text-teal-600">KASIR / SELESAI</span>.
                    </div>

                    <Button variant="primary" size="lg" type="submit">
                      <Save className="w-5 h-5" /> Simpan EMR Pasien
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RekamMedisPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm">Memuat modul Rekam Medis...</div>}>
      <RekamMedisContent />
    </Suspense>
  );
}
