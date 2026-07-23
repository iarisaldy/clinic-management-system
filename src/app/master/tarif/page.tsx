'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/store/ClinicContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { MedicalService } from '@/lib/types/clinic';
import { formatRupiah } from '@/lib/utils';
import { Activity, Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function MasterTarifPage() {
  const { services, addService, updateService, deleteService } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<MedicalService | null>(null);

  const [form, setForm] = useState({
    code: '',
    name: '',
    category: 'Tindakan',
    price: 35000,
  });

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingService(null);
    setForm({
      code: `SRV-00${services.length + 1}`,
      name: '',
      category: 'Tindakan',
      price: 35000,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (serv: MedicalService) => {
    setEditingService(serv);
    setForm({
      code: serv.code,
      name: serv.name,
      category: serv.category,
      price: serv.price,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) return;

    if (editingService) {
      updateService(editingService.id, form);
    } else {
      addService(form);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data tarif "${name}"?`)) {
      deleteService(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Activity className="w-7 h-7 text-teal-600" /> Master Data Tarif Tindakan & Layanan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola daftar harga jasa konsultasi dokter, pemeriksaan laboratorium, dan tindakan medis.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4" /> Tambah Tarif Tindakan
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Layanan / Kode..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardContent className="p-0">
          {filteredServices.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <Activity className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-sm">Tidak ada tarif tindakan ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Kode Service</th>
                    <th className="p-4">Nama Layanan / Prosedur</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4 text-right">Standard Tarif (Rp)</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredServices.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-4 font-mono font-bold text-slate-500">{s.code}</td>
                      <td className="p-4 font-extrabold text-slate-900 dark:text-white text-sm">
                        {s.name}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800">
                          {s.category}
                        </span>
                      </td>
                      <td className="p-4 text-right font-extrabold text-teal-600 dark:text-teal-400 text-sm">
                        {formatRupiah(s.price)}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id, s.name)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Form Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Tarif Layanan' : 'Tambah Tarif Layanan Baru'}
        subtitle="Kelola parameter harga tindakan medis klinik"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Kode Service"
            required
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />

          <Input
            label="Nama Layanan / Prosedur"
            placeholder="Contoh: Pemeriksaan Gula Darah, Rawat Luka Light..."
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Select
            label="Kategori"
            options={[
              { value: 'Pemeriksaan', label: 'Pemeriksaan' },
              { value: 'Laboratorium', label: 'Laboratorium' },
              { value: 'Tindakan', label: 'Tindakan Medis' },
            ]}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <Input
            label="Tarif / Harga (Rp)"
            type="number"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              {editingService ? 'Simpan Perubahan' : 'Tambah Layanan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
