'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useClinic } from '@/lib/store/ClinicContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Invoice, PaymentMethod } from '@/lib/types/clinic';
import { formatRupiah, formatTanggal, hitungUmur } from '@/lib/utils';
import {
  CreditCard,
  Printer,
  CheckCircle,
  Clock,
  Receipt,
  QrCode,
  Banknote,
  Building2,
  Stethoscope,
  Pill,
  ShieldCheck,
  Check
} from 'lucide-react';

function KasirContent() {
  const searchParams = useSearchParams();
  const queueIdParam = searchParams.get('queueId');

  const { queues, invoices, medicalRecords, payInvoice } = useClinic();

  // Active cashier queues
  const cashierQueues = queues.filter((q) => q.status === 'kasir');

  // Selected queue
  const [selectedQueueId, setSelectedQueueId] = useState<string>('');

  useEffect(() => {
    if (queueIdParam && cashierQueues.some((q) => q.id === queueIdParam)) {
      setSelectedQueueId(queueIdParam);
    } else if (cashierQueues.length > 0 && !selectedQueueId) {
      setSelectedQueueId(cashierQueues[0].id);
    }
  }, [queueIdParam, cashierQueues]);

  // Find invoice for selected queue
  const activeInvoice = invoices.find((inv) => inv.queue_id === selectedQueueId);
  const activeQueue = queues.find((q) => q.id === selectedQueueId);
  const activeMedicalRecord = activeInvoice?.medical_record || medicalRecords.find((mr) => mr.queue_id === selectedQueueId);

  // Payment Form Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paidAmount, setPaidAmount] = useState<number>(0);

  // Receipt Modal State
  const [completedInvoice, setCompletedInvoice] = useState<Invoice | null>(null);

  // Open Payment Modal
  const handleOpenPayModal = () => {
    if (!activeInvoice) return;
    setPaidAmount(activeInvoice.total_amount);
    setIsPayModalOpen(true);
  };

  // Submit Payment
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvoice) return;

    if (paymentMethod === 'cash' && paidAmount < activeInvoice.total_amount) {
      alert('Jumlah uang bayar kurang dari total tagihan!');
      return;
    }

    const res = payInvoice(activeInvoice.id, paymentMethod, paidAmount);
    setIsPayModalOpen(false);

    if (res) {
      setCompletedInvoice(res);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-purple-600" /> Kasir & Pembayaran Tagihan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kalkulasi otomatis biaya konsultasi dokter, tindakan, dan obat-obatan dengan cetak struk pembayaran.
          </p>
        </div>

        {/* Queue Selector Pill */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">
            Antrean Kasir:
          </label>
          <select
            className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
            value={selectedQueueId}
            onChange={(e) => setSelectedQueueId(e.target.value)}
          >
            {cashierQueues.length === 0 ? (
              <option value="">(Tidak ada antrean kasir)</option>
            ) : (
              cashierQueues.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.queue_number} - {q.patient?.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Main Billing Grid */}
      {!activeQueue || !activeInvoice ? (
        <Card className="p-12 text-center text-slate-500">
          <Receipt className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-base text-slate-700 dark:text-slate-200">
            Belum ada antrean kasir aktif
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Pasien yang selesai diperiksa dokter akan otomatis muncul di layar kasir ini untuk pemrosesan pembayaran.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Invoice Item Breakdown (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-purple-600" /> Rincian Tagihan Layanan Pasien
                  </CardTitle>
                  <CardDescription>
                    No. Invoice: <span className="font-mono font-bold text-slate-900 dark:text-white">{activeInvoice.invoice_number}</span>
                  </CardDescription>
                </div>
                <Badge variant="kasir">MENUNGGU PEMBAYARAN</Badge>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Patient Info Card */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Identitas Pasien</span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                      {activeQueue.patient?.name}
                    </h4>
                    <p className="text-slate-500">
                      NIK: {activeQueue.patient?.nik} • Phone: {activeQueue.patient?.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Nomor Antrean</span>
                    <p className="font-extrabold text-lg text-emerald-600 whitespace-nowrap">{activeQueue.queue_number}</p>
                  </div>
                </div>

                {/* Dokter & Diagnosis Summary */}
                {activeMedicalRecord && (
                  <div className="p-3.5 bg-teal-50/50 dark:bg-teal-950/20 rounded-xl border border-teal-200/60 dark:border-teal-800/60 text-xs space-y-1">
                    <p className="font-semibold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                      <Stethoscope className="w-4 h-4" /> Diagnosis Dokter ({activeMedicalRecord.doctor_name}):
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white pl-5">
                      {activeMedicalRecord.diagnosis}
                    </p>
                  </div>
                )}

                {/* Billing Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Layanan / Item</th>
                        <th className="p-3.5 text-center">Kategori</th>
                        <th className="p-3.5 text-center">Qty</th>
                        <th className="p-3.5 text-right">Harga</th>
                        <th className="p-3.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {/* Jasa Dokter */}
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                          Konsultasi & Pemeriksaan Dokter Umum
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 text-[10px] font-semibold">
                            Pemeriksaan
                          </span>
                        </td>
                        <td className="p-3.5 text-center">1</td>
                        <td className="p-3.5 text-right">{formatRupiah(activeInvoice.consultation_fee)}</td>
                        <td className="p-3.5 text-right font-bold">{formatRupiah(activeInvoice.consultation_fee)}</td>
                      </tr>

                      {/* Tindakan Tambahan if any */}
                      {activeInvoice.action_fee > 0 && (
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                            Tindakan / Prosedur Medis Tambahan
                          </td>
                          <td className="p-3.5 text-center">
                            <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 text-[10px] font-semibold">
                              Tindakan
                            </span>
                          </td>
                          <td className="p-3.5 text-center">1</td>
                          <td className="p-3.5 text-right">{formatRupiah(activeInvoice.action_fee)}</td>
                          <td className="p-3.5 text-right font-bold">{formatRupiah(activeInvoice.action_fee)}</td>
                        </tr>
                      )}

                      {/* Prescribed Medicines */}
                      {activeMedicalRecord?.prescriptions.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-3.5">
                            <p className="font-bold text-slate-900 dark:text-white">{item.medicine_name}</p>
                            <p className="text-[11px] text-slate-400 italic">Aturan: {item.instruction}</p>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 text-[10px] font-semibold">
                              Obat Resep
                            </span>
                          </td>
                          <td className="p-3.5 text-center font-bold">{item.quantity}</td>
                          <td className="p-3.5 text-right">{formatRupiah(item.unit_price)}</td>
                          <td className="p-3.5 text-right font-bold">
                            {formatRupiah(item.unit_price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Total Calculation & Pay Action (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-2 border-purple-500/30">
              <CardHeader className="bg-purple-950 text-white rounded-t-xl">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-300" /> Ringkasan Pembayaran
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Total kalkulasi biaya berobat
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Biaya Dokter:</span>
                    <span className="font-semibold">{formatRupiah(activeInvoice.consultation_fee)}</span>
                  </div>

                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Biaya Tindakan:</span>
                    <span className="font-semibold">{formatRupiah(activeInvoice.action_fee)}</span>
                  </div>

                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Total Obat ({activeMedicalRecord?.prescriptions.length || 0} item):</span>
                    <span className="font-semibold">{formatRupiah(activeInvoice.medicine_fee)}</span>
                  </div>

                  <div className="flex justify-between pt-3 pb-1 text-sm">
                    <span className="font-extrabold text-slate-900 dark:text-white">TOTAL TAGIHAN:</span>
                    <span className="font-black text-xl text-purple-600 dark:text-purple-400">
                      {formatRupiah(activeInvoice.total_amount)}
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/20"
                    onClick={handleOpenPayModal}
                  >
                    <CreditCard className="w-5 h-5" /> Proses Bayar Sekarang
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Modal 1: Process Payment Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Konfirmasi Pembayaran Kasir"
        subtitle={`Pasien: ${activeQueue?.patient?.name} | Total Tagihan: ${formatRupiah(activeInvoice?.total_amount || 0)}`}
        maxWidth="md"
      >
        <form onSubmit={handleConfirmPayment} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'cash', label: 'Tunai / Cash', icon: Banknote },
                { id: 'qris', label: 'QRIS', icon: QrCode },
                { id: 'transfer', label: 'Transfer', icon: Building2 },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nominal Diterima (Rp)"
              type="number"
              required
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
            />

            <div className="w-full space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Uang Kembalian
              </label>
              <div className="w-full px-3.5 py-2 text-sm font-extrabold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-emerald-600 dark:text-emerald-400">
                {formatRupiah(Math.max(0, paidAmount - (activeInvoice?.total_amount || 0)))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-300">
            <p className="font-bold flex items-center gap-1">
              <Check className="w-4 h-4" /> Otomatisasi Pemotongan Stok:
            </p>
            <p className="mt-0.5">
              Saat pembayaran dikonfirmasi, stok obat master data akan otomatis terpotong sesuai jumlah resep.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsPayModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" type="submit" className="bg-purple-600 hover:bg-purple-700">
              Konfirmasi & Selesaikan Pembayaran
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Printable Receipt / Struk Pembayaran */}
      <Modal
        isOpen={!!completedInvoice}
        onClose={() => setCompletedInvoice(null)}
        title="Struk Pembayaran Berhasil Disimpan"
        subtitle="Cetak struk fisik untuk diserahkan kepada pasien"
        maxWidth="lg"
      >
        {completedInvoice && (
          <div className="space-y-6">
            {/* PRINTABLE CONTAINER AREA */}
            <div
              id="printable-receipt"
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 space-y-4"
            >
              {/* Receipt Header */}
              <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-4">
                <h2 className="font-black text-lg tracking-tight uppercase">KLINIK PRATAMA SEHAT</h2>
                <p className="text-xs text-slate-500">Jl. Sukajadi No. 45, Bandung • Telp: (022) 7654321</p>
                <p className="text-xs font-mono mt-1 text-slate-400">
                  STRUK BUKTI PEMBAYARAN KASIR
                </p>
              </div>

              {/* Transaction Metadata */}
              <div className="grid grid-cols-2 text-xs space-y-1">
                <div>
                  <p className="text-slate-500">No. Invoice:</p>
                  <p className="font-mono font-bold">{completedInvoice.invoice_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500">Tanggal Transaksi:</p>
                  <p className="font-semibold">{formatTanggal(completedInvoice.paid_at || '')}</p>
                </div>
                <div>
                  <p className="text-slate-500 mt-2">Nama Pasien:</p>
                  <p className="font-bold">{completedInvoice.patient?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 mt-2">Metode Bayar:</p>
                  <p className="font-bold uppercase text-purple-600">{completedInvoice.payment_method}</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border-t border-b border-dashed border-slate-300 dark:border-slate-700 py-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                      <th className="text-left pb-2">Item Layanan</th>
                      <th className="text-center pb-2">Qty</th>
                      <th className="text-right pb-2">Harga</th>
                      <th className="text-right pb-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-2 font-medium">Jasa Konsultasi Dokter</td>
                      <td className="text-center">1</td>
                      <td className="text-right">{formatRupiah(completedInvoice.consultation_fee)}</td>
                      <td className="text-right font-bold">{formatRupiah(completedInvoice.consultation_fee)}</td>
                    </tr>
                    {completedInvoice.action_fee > 0 && (
                      <tr>
                        <td className="py-2 font-medium">Tindakan Medis Tambahan</td>
                        <td className="text-center">1</td>
                        <td className="text-right">{formatRupiah(completedInvoice.action_fee)}</td>
                        <td className="text-right font-bold">{formatRupiah(completedInvoice.action_fee)}</td>
                      </tr>
                    )}
                    {completedInvoice.medical_record?.prescriptions.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2">
                          <p className="font-medium">{item.medicine_name}</p>
                          <p className="text-[10px] text-slate-400">{item.instruction}</p>
                        </td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-right">{formatRupiah(item.unit_price)}</td>
                        <td className="text-right font-bold">{formatRupiah(item.unit_price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation */}
              <div className="space-y-1 text-xs text-right pt-1">
                <div className="flex justify-between font-bold text-sm">
                  <span>TOTAL PEMBAYARAN:</span>
                  <span className="text-emerald-600">{formatRupiah(completedInvoice.total_amount)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Jumlah Dibayar:</span>
                  <span>{formatRupiah(completedInvoice.paid_amount)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Kembalian:</span>
                  <span>{formatRupiah(completedInvoice.change_amount)}</span>
                </div>
              </div>

              {/* Footer text */}
              <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-dashed border-slate-300 dark:border-slate-700">
                <p>Terima kasih telah berobat di Klinik Pratama Sehat.</p>
                <p>Semoga lekas sembuh!</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCompletedInvoice(null)}>
                Tutup Screen
              </Button>
              <Button variant="primary" onClick={handlePrintReceipt}>
                <Printer className="w-4 h-4" /> Cetak Struk Fisik
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function KasirPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm">Memuat modul Kasir...</div>}>
      <KasirContent />
    </Suspense>
  );
}

