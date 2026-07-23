'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/store/ClinicContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Medicine } from '@/lib/types/clinic';
import { formatRupiah } from '@/lib/utils';
import {
  Pill,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  PackageCheck,
  Filter
} from 'lucide-react';

export default function MasterObatPage() {
  const { medicines, addMedicine, updateMedicine, deleteMedicine } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);

  const [form, setForm] = useState({
    code: '',
    name: '',
    category: 'Analgesik & Antipiretik',
    unit: 'Tablet',
    sell_price: 5000,
    stock: 100,
    min_stock: 15,
  });

  const categories = Array.from(new Set(medicines.map((m) => m.category)));

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? m.category === categoryFilter : true;
    const matchesLowStock = showLowStockOnly ? m.stock <= m.min_stock : true;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const handleOpenAdd = () => {
    setEditingMed(null);
    setForm({
      code: `OBT-00${medicines.length + 1}`,
      name: '',
      category: 'Analgesik & Antipiretik',
      unit: 'Tablet',
      sell_price: 5000,
      stock: 100,
      min_stock: 15,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (med: Medicine) => {
    setEditingMed(med);
    setForm({
      code: med.code,
      name: med.name,
      category: med.category,
      unit: med.unit,
      sell_price: med.sell_price,
      stock: med.stock,
      min_stock: med.min_stock,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) return;

    if (editingMed) {
      updateMedicine(editingMed.id, form);
    } else {
      addMedicine(form);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data obat "${name}"?`)) {
      deleteMedicine(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Pill className="w-7 h-7 text-emerald-600" /> Master Data Obat & Persediaan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola katalog obat, harga jual, jumlah stok, dan batas alert persediaan minimal.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4" /> Tambah Obat Baru
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Kode atau Nama Obat..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                showLowStockOnly
                  ? 'bg-rose-500 text-white border-rose-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Stok Menipis Only</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Medicines Data Table */}
      <Card>
        <CardContent className="p-0">
          {filteredMedicines.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <Pill className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-sm">Tidak ada data obat ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Kode</th>
                    <th className="p-4">Nama Obat</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Satuan</th>
                    <th className="p-4 text-right">Harga Jual</th>
                    <th className="p-4 text-center">Stok Saat Ini</th>
                    <th className="p-4 text-center">Min. Stok</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredMedicines.map((m) => {
                    const isLowStock = m.stock <= m.min_stock;
                    return (
                      <tr
                        key={m.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-900/50 ${
                          isLowStock ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''
                        }`}
                      >
                        <td className="p-4 font-mono font-bold text-slate-500">{m.code}</td>
                        <td className="p-4">
                          <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {m.name}
                          </p>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                            {m.category}
                          </span>
                        </td>
                        <td className="p-4 font-medium">{m.unit}</td>
                        <td className="p-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(m.sell_price)}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full font-bold ${
                              isLowStock
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {m.stock} {m.unit}
                          </span>
                        </td>
                        <td className="p-4 text-center text-slate-500 font-semibold">{m.min_stock}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(m)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(m.id, m.name)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Add/Edit Medicine */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMed ? 'Edit Data Obat' : 'Tambah Obat Baru'}
        subtitle="Lengkapi informasi katalog obat dan stok persediaan"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Kode Obat"
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />

            <Input
              label="Nama Lengkap Obat"
              placeholder="Contoh: Paracetamol 500mg"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Kategori Obat"
              placeholder="Analgesik, Antibiotik, Vitamin, dll."
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <Select
              label="Satuan Obat"
              options={[
                { value: 'Tablet', label: 'Tablet' },
                { value: 'Kaplet', label: 'Kaplet' },
                { value: 'Kapsul', label: 'Kapsul' },
                { value: 'Botol', label: 'Botol' },
                { value: 'Strip', label: 'Strip' },
                { value: 'Tube', label: 'Tube' },
              ]}
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Harga Jual per Satuan (Rp)"
              type="number"
              required
              value={form.sell_price}
              onChange={(e) => setForm({ ...form, sell_price: Number(e.target.value) })}
            />

            <Input
              label="Jumlah Stok Saat Ini"
              type="number"
              required
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            />

            <Input
              label="Batas Minimal Stok Alert"
              type="number"
              required
              value={form.min_stock}
              onChange={(e) => setForm({ ...form, min_stock: Number(e.target.value) })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              {editingMed ? 'Simpan Perubahan' : 'Tambah Obat'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
