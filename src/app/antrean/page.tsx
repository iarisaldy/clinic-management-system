'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/store/ClinicContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Patient, QueueStatus } from '@/lib/types/clinic';
import { formatTanggal, hitungUmur } from '@/lib/utils';
import {
  UserPlus,
  Search,
  Users,
  Ticket,
  Stethoscope,
  XCircle,
  Plus,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function AntreanPage() {
  const { patients, queues, addPatient, addQueue, updateQueueStatus } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('semua');
  
  // Modal State Form Pasien Baru
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatientForm, setNewPatientForm] = useState({
    nik: '',
    name: '',
    phone: '',
    dob: '',
    gender: 'L' as 'L' | 'P',
    address: '',
    allergies: '',
  });

  // Complaint modal state
  const [selectedPatientForQueue, setSelectedPatientForQueue] = useState<Patient | null>(null);
  const [complaintText, setComplaintText] = useState('');

  // Filter patients by search query
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nik.includes(searchQuery) ||
      p.phone.includes(searchQuery)
  );

  // Today's Date String
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayQueues = queues.filter((q) => q.queue_date === todayStr);

  const displayQueues = todayQueues.filter((q) => {
    if (selectedStatusFilter === 'semua') return true;
    return q.status === selectedStatusFilter;
  });

  const handleRegisterNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientForm.name || !newPatientForm.nik || !newPatientForm.dob) return;

    const created = addPatient({
      nik: newPatientForm.nik,
      name: newPatientForm.name,
      phone: newPatientForm.phone,
      dob: newPatientForm.dob,
      gender: newPatientForm.gender,
      address: newPatientForm.address,
      allergies: newPatientForm.allergies || 'Tidak ada',
    });

    setIsModalOpen(false);
    // Reset form
    setNewPatientForm({
      nik: '',
      name: '',
      phone: '',
      dob: '',
      gender: 'L',
      address: '',
      allergies: '',
    });

    // Auto open queue complaint prompt for this new patient
    setSelectedPatientForQueue(created);
  };

  const handleCreateQueue = () => {
    if (!selectedPatientForQueue) return;
    addQueue(selectedPatientForQueue.id, complaintText || 'Konsultasi & Pemeriksaan Umum');
    setSelectedPatientForQueue(null);
    setComplaintText('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-600" /> Pendaftaran & Antrean Pasien
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cari data pasien lama atau daftarkan pasien baru untuk mendapatkan nomor antrean harian.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus className="w-4 h-4" /> Daftarkan Pasien Baru
        </Button>
      </div>

      {/* Main Grid: Search & Register Left | Queue Board Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & Ambil Antrean (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" /> Cari Pasien / Ambil Nomor Antrean
              </CardTitle>
              <CardDescription>
                Masukkan Nama, NIK, atau No. HP pasien terdaftar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ketik Nama / NIK / Phone..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Search Result List */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredPatients.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="font-semibold text-slate-500">Pasien tidak ditemukan</p>
                    <p className="mt-1">Silakan klik "Daftarkan Pasien Baru".</p>
                  </div>
                ) : (
                  filteredPatients.map((p) => {
                    const isAlreadyQueuedToday = todayQueues.some(
                      (q) => q.patient_id === p.id && q.status !== 'selesai' && q.status !== 'batal'
                    );

                    return (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-white dark:bg-slate-900 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600">
                              {p.name}
                            </h4>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {p.gender === 'L' ? 'L' : 'P'}, {hitungUmur(p.dob)} thn
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                            <span>NIK: {p.nik}</span>
                            <span>• {p.phone}</span>
                          </div>
                          {p.allergies && (
                            <p className="text-[11px] text-rose-500 mt-0.5 font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Alergi: {p.allergies}
                            </p>
                          )}
                        </div>

                        <div>
                          {isAlreadyQueuedToday ? (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded border border-amber-200">
                              Sudah Masuk Antrean
                            </span>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPatientForQueue(p)}
                            >
                              <Ticket className="w-3.5 h-3.5 text-emerald-600" /> Ambil Antrean
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Dynamic Queue List (7 cols) */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-emerald-600" /> Antrean Pasien Hari Ini ({todayQueues.length})
                </CardTitle>
                <CardDescription>Nomor antrean dan status pelayanan berjalan</CardDescription>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {['semua', 'menunggu', 'pemeriksaan', 'kasir', 'selesai'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      selectedStatusFilter === st
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {displayQueues.length === 0 ? (
                <div className="p-10 text-center text-slate-400">
                  <Clock className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-sm">Tidak ada antrean dalam filter ini</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {displayQueues.map((item) => (
                    <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="min-w-[4.5rem] h-12 sm:h-14 px-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-emerald-400 font-black text-base sm:text-lg flex items-center justify-center shadow-lg border border-slate-700 shrink-0 whitespace-nowrap tracking-wide">
                          {item.queue_number}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                              {item.patient?.name}
                            </h4>
                            <span className="text-xs text-slate-400">
                              ({item.patient?.gender}, {hitungUmur(item.patient?.dob || '')} thn)
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Keluhan: <span className="font-medium text-slate-700 dark:text-slate-300">{item.complaint}</span>
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            NIK: {item.patient?.nik} • Phone: {item.patient?.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                        <Badge variant={item.status}>{item.status.toUpperCase()}</Badge>


                        {/* Action buttons based on status */}
                        <div className="flex items-center gap-1.5">
                          {item.status === 'menunggu' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => updateQueueStatus(item.id, 'pemeriksaan')}
                            >
                              <Stethoscope className="w-3.5 h-3.5" /> Panggil ke Dokter
                            </Button>
                          )}

                          {item.status !== 'selesai' && item.status !== 'batal' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-rose-500 hover:bg-rose-50"
                              onClick={() => updateQueueStatus(item.id, 'batal')}
                            >
                              <XCircle className="w-3.5 h-3.5" /> Batal
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal 1: Form Pendaftaran Pasien Baru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Form Pendaftaran Pasien Baru"
        subtitle="Lengkapi identitas sesuai KTP/Kartu Identitas Pasien"
        maxWidth="lg"
      >
        <form onSubmit={handleRegisterNewPatient} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nomor NIK (16 Digit)"
              placeholder="Contoh: 3273011508920001"
              required
              maxLength={16}
              value={newPatientForm.nik}
              onChange={(e) => setNewPatientForm({ ...newPatientForm, nik: e.target.value })}
            />

            <Input
              label="Nama Lengkap Pasien"
              placeholder="Nama sesuai KTP"
              required
              value={newPatientForm.name}
              onChange={(e) => setNewPatientForm({ ...newPatientForm, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="No. HP / WhatsApp"
              placeholder="0812xxxx"
              required
              value={newPatientForm.phone}
              onChange={(e) => setNewPatientForm({ ...newPatientForm, phone: e.target.value })}
            />

            <Input
              label="Tanggal Lahir"
              type="date"
              required
              value={newPatientForm.dob}
              onChange={(e) => setNewPatientForm({ ...newPatientForm, dob: e.target.value })}
            />

            <Select
              label="Jenis Kelamin"
              options={[
                { value: 'L', label: 'Laki-laki' },
                { value: 'P', label: 'Perempuan' },
              ]}
              value={newPatientForm.gender}
              onChange={(e) => setNewPatientForm({ ...newPatientForm, gender: e.target.value as 'L' | 'P' })}
            />
          </div>

          <Input
            label="Alamat Tempat Tinggal"
            placeholder="Jl. Sukajadi No. XX, Bandung"
            required
            value={newPatientForm.address}
            onChange={(e) => setNewPatientForm({ ...newPatientForm, address: e.target.value })}
          />

          <Input
            label="Riwayat Alergi (Opsional)"
            placeholder="Alergi Penisilin, Seafood, Udara Dingin, dll."
            value={newPatientForm.allergies}
            onChange={(e) => setNewPatientForm({ ...newPatientForm, allergies: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              Simpan & Daftarkan Pasien
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Konfirmasi Ambil Antrean & Keluhan */}
      <Modal
        isOpen={!!selectedPatientForQueue}
        onClose={() => setSelectedPatientForQueue(null)}
        title="Konfirmasi Cetak Nomor Antrean"
        subtitle={`Pasien: ${selectedPatientForQueue?.name} (NIK: ${selectedPatientForQueue?.nik})`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <Input
            label="Keluhan Utama / Alasan Berobat"
            placeholder="Contoh: Demam, Batuk, Pusing, Cek Kesehatan..."
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
          />

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
            <p className="font-bold flex items-center gap-1.5">
              <Ticket className="w-4 h-4" /> Nomor Antrean Otomatis
            </p>
            <p className="mt-1">
              Pasien akan diberikan tiket antrean berurutan hari ini dengan status <strong>MENUNGGU</strong>.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setSelectedPatientForQueue(null)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleCreateQueue}>
              Cetak & Masukkan Antrean
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
