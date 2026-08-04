'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClinic } from '@/lib/store/ClinicContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah, formatTanggal, hitungUmur } from '@/lib/utils';
import {
  Users,
  Clock,
  Wallet,
  AlertTriangle,
  UserPlus,
  Stethoscope,
  CreditCard,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  FileCheck
} from 'lucide-react';

export default function DashboardPage() {
  const { role, patients, queues, medicines, invoices, medicalRecords } = useClinic();

  const todayStr = new Date().toISOString().slice(0, 10);

  // Today's queues
  const todayQueues = queues.filter((q) => q.queue_date === todayStr);
  const waitingQueues = todayQueues.filter((q) => q.status === 'menunggu');
  const activeExamQueues = todayQueues.filter((q) => q.status === 'pemeriksaan');
  const cashierQueues = todayQueues.filter((q) => q.status === 'kasir');
  const completedQueues = todayQueues.filter((q) => q.status === 'selesai');

  // Low stock medicines
  const lowStockMeds = medicines.filter((m) => m.stock <= m.min_stock);

  // Today's Revenue
  const todayRevenue = invoices
    .filter((inv) => inv.payment_status === 'paid' && inv.paid_at?.startsWith(todayStr))
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Role Greeting */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-500/30">
                Praktik Mandiri dr. Hendra Pratama, Sp.PD
              </span>
              <span className="text-slate-400 text-xs">• Solo Practice Suite</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Selamat Datang di System Praktik Dokter Mandiri
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Sistem ringkas membantu Dokter melayani pasien mandiri: pendaftaran, rekam medis (EMR), cetak surat kesehatan/rujukan RS, hingga kelola obat & tarif.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/rekam-medis">
              <Button variant="primary" size="md" className="bg-teal-600 hover:bg-teal-700">
                <Stethoscope className="w-4 h-4" />
                Buka Rekam Medis (EMR)
              </Button>
            </Link>
            <Link href="/surat">
              <Button variant="secondary" size="md">
                <FileText className="w-4 h-4" />
                Cetak Surat & Rujukan
              </Button>
            </Link>
          </div>
        </div>
      </div>


      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pasien */}
        <Card className="hover:border-emerald-500/50 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Pasien Terdaftar</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {patients.length} <span className="text-xs font-normal text-slate-500">pasien</span>
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-emerald-600 font-semibold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +3
              </span>
              <span>pasien baru minggu ini</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Antrean Aktif Hari Ini */}
        <Card className="hover:border-amber-500/50 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Antrean Hari Ini</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {todayQueues.length} <span className="text-xs font-normal text-slate-500">orang</span>
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-800">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-amber-600 font-medium">{waitingQueues.length} Menunggu</span>
              <span className="text-blue-600 font-medium">{activeExamQueues.length} Pemeriksaan</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Pendapatan Hari Ini */}
        <Card className="hover:border-emerald-500/50 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pendapatan Kasir Hari Ini</p>
                <h3 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatRupiah(todayRevenue)}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
              <span>{completedQueues.length} transaksi selesai</span>
              <span className="text-purple-600 font-medium">{cashierQueues.length} di Kasir</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Alert Obat Menipis */}
        <Card className="hover:border-rose-500/50 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Peringatan Stok Obat</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {lowStockMeds.length}{' '}
                  <span className="text-xs font-normal text-rose-500">perlu restok</span>
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-800">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 text-xs text-rose-600 font-medium flex items-center justify-between">
              <Link href="/master/obat" className="hover:underline flex items-center gap-1">
                Kelola Stok Master Obat <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Queue Status */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Daftar Antrean Pasien Hari Ini</CardTitle>
              <CardDescription>
                Urutan antrean pemeriksaan berjalan di klinik
              </CardDescription>
            </div>
            <Link href="/antrean">
              <Button variant="outline" size="sm">
                Lihat Semua Antrean
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="p-0">
            {todayQueues.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Clock className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-medium text-sm">Belum ada antrean terdaftar hari ini</p>
                <p className="text-xs text-slate-400 mt-1">
                  Silakan daftarkan pasien baru atau pasien lama melalui menu Pendaftaran.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {todayQueues.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="min-w-[4rem] h-12 px-3 rounded-xl bg-slate-900 text-emerald-400 font-extrabold text-sm sm:text-base flex items-center justify-center shadow-md whitespace-nowrap shrink-0 tracking-wide">
                        {item.queue_number}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {item.patient?.name || 'Pasien'}
                          </h4>
                          <span className="text-xs text-slate-400">
                            ({item.patient?.gender === 'L' ? 'Laki-laki' : 'Perempuan'},{' '}
                            {hitungUmur(item.patient?.dob || '')} thn)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Keluhan: <span className="italic">{item.complaint || '-'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={item.status}>{item.status.toUpperCase()}</Badge>

                      {role === 'dokter' && item.status === 'pemeriksaan' && (
                        <Link href={`/rekam-medis?queueId=${item.id}`}>
                          <Button variant="secondary" size="sm">
                            <Stethoscope className="w-3.5 h-3.5" /> Pemeriksaan
                          </Button>
                        </Link>
                      )}

                      {role === 'admin' && item.status === 'kasir' && (
                        <Link href={`/kasir?queueId=${item.id}`}>
                          <Button variant="primary" size="sm">
                            <CreditCard className="w-3.5 h-3.5" /> Pembayaran
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right 1 Col: Quick Widgets */}
        <div className="space-y-6">
          {/* Quick Action Widget */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat Menu</CardTitle>
              <CardDescription>Shortcut ke alur pelayanan utama</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Link href="/antrean" className="block">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                        Pendaftaran & Antrean
                      </h4>
                      <p className="text-[11px] text-slate-500">Cetak tiket antrean pasien</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </div>
              </Link>

              <Link href="/rekam-medis" className="block">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600">
                        Rekam Medis Dokter
                      </h4>
                      <p className="text-[11px] text-slate-500">Input diagnosis & resep obat</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                </div>
              </Link>

              <Link href="/surat" className="block">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                        Cetak Surat & Rujukan RS
                      </h4>
                      <p className="text-[11px] text-slate-500">Surat sehat, rujukan RS & surat sakit</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </div>
              </Link>

              <Link href="/kasir" className="block">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600">
                        Kasir & Pembayaran
                      </h4>
                      <p className="text-[11px] text-slate-500">Hitung tagihan & cetak struk</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                </div>
              </Link>

            </CardContent>
          </Card>

          {/* Low Stock Warning List Widget */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm">Stok Obat Menipis</CardTitle>
                <CardDescription>Alert persediaan minimal</CardDescription>
              </div>
              <Link href="/master/obat">
                <span className="text-xs text-rose-600 hover:underline font-semibold">Master Obat</span>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {lowStockMeds.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Stok semua obat dalam kondisi aman
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {lowStockMeds.map((med) => (
                    <div key={med.id} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{med.name}</p>
                        <p className="text-[11px] text-slate-400">{med.category}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs">
                          {med.stock} {med.unit}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Min: {med.min_stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
