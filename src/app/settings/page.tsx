'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/store/ClinicContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Settings,
  User,
  Building2,
  FileCheck,
  Save,
  CheckCircle2,
  Phone,
  MapPin,
  Shield,
  Sparkles,
  Printer
} from 'lucide-react';

export default function SettingsPage() {
  const { doctorProfile, updateDoctorProfile } = useClinic();

  const [form, setForm] = useState({
    name: doctorProfile.name,
    title: doctorProfile.title,
    sip: doctorProfile.sip,
    str: doctorProfile.str,
    clinic_name: doctorProfile.clinic_name,
    address: doctorProfile.address,
    city: doctorProfile.city,
    phone: doctorProfile.phone,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDoctorProfile(form);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-teal-600" /> Pengaturan Profil Dokter & Kop Surat
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ubah identitas dokter, nomor SIP, STR, nama tempat praktik, dan alamat untuk memperbarui Kop Surat dinamis.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Profil & Kop Surat Berhasil Disimpan!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Settings (7 cols) */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader className="bg-slate-50/60 dark:bg-slate-900/60">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" /> Form Data Identitas Praktik
              </CardTitle>
              <CardDescription>
                Isi data resmi dokter praktik mandiri untuk dicantumkan pada surat & kuitansi.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nama Lengkap & Gelar"
                    placeholder="e.g. dr. Hendra Pratama, Sp.PD"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Spesialisasi / Jabatan"
                    placeholder="e.g. Dokter Spesialis Penyakit Dalam"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nomor SIP (Surat Izin Praktik)"
                    placeholder="e.g. 449/123/SIP-DR/DISKES/2024"
                    value={form.sip}
                    onChange={(e) => setForm({ ...form, sip: e.target.value })}
                    required
                  />
                  <Input
                    label="Nomor STR (Surat Tanda Registrasi)"
                    placeholder="e.g. 31.1.1.100.2.19.123456"
                    value={form.str}
                    onChange={(e) => setForm({ ...form, str: e.target.value })}
                    required
                  />
                </div>

                <hr className="border-slate-100 dark:border-slate-800 my-2" />

                <Input
                  label="Nama Tempat Praktik / Klinik"
                  placeholder="e.g. Praktik Dokter Mandiri dr. Hendra"
                  value={form.clinic_name}
                  onChange={(e) => setForm({ ...form, clinic_name: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Alamat Praktik"
                      placeholder="e.g. Jl. R.E. Martadinata No. 88"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    label="Kota Praktik"
                    placeholder="e.g. Bandung"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Nomor Telepon Praktik / WhatsApp"
                  placeholder="e.g. (022) 7201234 / 0812-3456-7890"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />

                <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
                  <Button variant="primary" size="lg" type="submit" className="bg-teal-600 hover:bg-teal-700">
                    <Save className="w-5 h-5" /> Simpan Pengaturan Profil
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Kop Surat Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="bg-slate-50/60 dark:bg-slate-900/60">
              <CardTitle className="text-sm flex items-center gap-2">
                <Printer className="w-4 h-4 text-teal-600" /> Live Preview Kop Surat Praktik
              </CardTitle>
              <CardDescription>
                Simulasi tampilan otomatis Kop Surat pada dokumen cetak
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {/* Preview Box */}
              <div className="bg-white text-slate-900 p-6 rounded-xl border border-slate-300 shadow-md font-sans text-xs space-y-4">
                <div className="border-b-2 border-slate-900 pb-3 text-center">
                  <h2 className="text-base font-black tracking-wide uppercase text-slate-900">
                    {form.clinic_name || 'PRAKTIK DOKTER MANDIRI'}
                  </h2>
                  <h3 className="text-sm font-bold text-teal-800 mt-0.5">
                    {form.name || 'dr. Hendra Pratama'}
                  </h3>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    SIP No: {form.sip || '449/123/SIP-DR/DISKES/2024'} • STR No: {form.str || '31.1.1.100.2.19.123456'}
                  </p>
                  <p className="text-[10px] text-slate-600">
                    Alamat: {form.address || 'Jl. R.E. Martadinata No. 88'}, {form.city || 'Bandung'} • Telp: {form.phone || '0812-3456-7890'}
                  </p>
                </div>

                <div className="text-center py-2 space-y-1">
                  <p className="font-bold underline text-xs">SURAT KETERANGAN SEHAT</p>
                  <p className="text-[10px] text-slate-500">Nomor: 001/SK-SEHAT/VII/2026</p>
                </div>

                <p className="text-[11px] text-slate-700 leading-relaxed italic text-center">
                  &quot;Contoh hasil pencetakan dokumen resmi dengan Kop Surat dinamis dokter...&quot;
                </p>

                <div className="pt-4 flex justify-between items-end text-[10px] text-slate-500 border-t border-slate-200">
                  <div>
                    <p className="text-slate-400">* Dokumen Praktik Sah</p>
                  </div>
                  <div className="text-center">
                    <p>{form.city || 'Bandung'}, 28 Juli 2026</p>
                    <p className="font-bold text-slate-900 mt-4">{form.name || 'dr. Hendra Pratama'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 text-[11px] text-teal-800 dark:text-teal-300">
                💡 <strong>Tips:</strong> Setiap perubahan yang Anda simpan di halaman ini akan langsung otomatis digunakan saat mencetak <strong>Surat Sehat</strong>, <strong>Surat Rujukan RS</strong>, dan <strong>Surat Sakit</strong> di menu Cetak Surat.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
