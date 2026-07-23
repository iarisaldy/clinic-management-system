'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/store/ClinicContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRupiah, formatTanggal } from '@/lib/utils';
import {
  BarChart3,
  Calendar,
  Wallet,
  CreditCard,
  Printer,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function LaporanPage() {
  const { invoices, medicalRecords, patients, medicines } = useClinic();

  const [dateFilter, setDateFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  // Paid invoices
  const paidInvoices = invoices.filter((i) => {
    if (i.payment_status !== 'paid') return false;
    const matchesMethod = methodFilter ? i.payment_method === methodFilter : true;
    const matchesDate = dateFilter ? i.paid_at?.startsWith(dateFilter) : true;
    return matchesMethod && matchesDate;
  });

  const totalRevenue = paidInvoices.reduce((sum, i) => sum + i.total_amount, 0);
  const totalConsultationRevenue = paidInvoices.reduce((sum, i) => sum + i.consultation_fee, 0);
  const totalMedicineRevenue = paidInvoices.reduce((sum, i) => sum + i.medicine_fee, 0);
  const totalActionRevenue = paidInvoices.reduce((sum, i) => sum + i.action_fee, 0);

  const avgPerPatient = paidInvoices.length > 0 ? totalRevenue / paidInvoices.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-emerald-600" /> Rekap Laporan & Keuangan Klinik
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ringkasan pendapatan bulanan/harian, omzet obat, jasa konsultasi, dan rincian transaksi kasir.
          </p>
        </div>

        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="w-4 h-4" /> Cetak / Export Laporan
        </Button>
      </div>

      {/* Financial Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-950/20">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-emerald-100">Total Pendapatan Terbayar</p>
            <h3 className="text-2xl font-black mt-1">{formatRupiah(totalRevenue)}</h3>
            <p className="text-[11px] text-emerald-200 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Dari {paidInvoices.length} transaksi lunas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-slate-500">Pendapatan Jasa Dokter</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {formatRupiah(totalConsultationRevenue)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-2">Tarif standar konsultasi & jasa</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-slate-500">Pendapatan Obat & Resep</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {formatRupiah(totalMedicineRevenue)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-2">Penjualan obat resep pasien</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-slate-500">Rata-Rata per Transaksi</p>
            <h3 className="text-xl font-bold text-teal-600 dark:text-teal-400 mt-1">
              {formatRupiah(avgPerPatient)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-2">Average spend per visit</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Filter Tanggal Transaksi
              </label>
              <input
                type="date"
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Metode Pembayaran
              </label>
              <select
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <option value="">Semua Metode</option>
                <option value="cash">Tunai / Cash</option>
                <option value="qris">QRIS</option>
                <option value="transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          {(dateFilter || methodFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDateFilter('');
                setMethodFilter('');
              }}
            >
              Reset Filter
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Paid Invoices Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Transaksi Kasir Lunas ({paidInvoices.length})
          </CardTitle>
          <CardDescription>Rincian invoice pembayaran pasien yang telah diselesaikan</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {paidInvoices.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-sm">Belum ada transaksi lunas pada filter ini</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">No. Invoice</th>
                    <th className="p-3.5">Tanggal Bayar</th>
                    <th className="p-3.5">Nama Pasien</th>
                    <th className="p-3.5 text-center">Metode</th>
                    <th className="p-3.5 text-right">Jasa Dokter</th>
                    <th className="p-3.5 text-right">Obat</th>
                    <th className="p-3.5 text-right">Total Transaksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paidInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        {inv.invoice_number}
                      </td>
                      <td className="p-3.5 text-slate-500">{formatTanggal(inv.paid_at || '')}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {inv.patient?.name}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="px-2.5 py-0.5 rounded font-bold uppercase text-[10px] bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {inv.payment_method}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">{formatRupiah(inv.consultation_fee)}</td>
                      <td className="p-3.5 text-right">{formatRupiah(inv.medicine_fee)}</td>
                      <td className="p-3.5 text-right font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatRupiah(inv.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
