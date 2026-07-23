'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClinic } from '@/lib/store/ClinicContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Pill,
  Activity,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { role, medicines, queues } = useClinic();

  // Stock alert counter
  const lowStockCount = medicines.filter((m) => m.stock <= m.min_stock).length;
  // Active queue count
  const activeQueueCount = queues.filter((q) => q.status === 'menunggu' || q.status === 'pemeriksaan').length;

  const navItems = [
    {
      label: 'Dashboard Overview',
      href: '/',
      icon: LayoutDashboard,
      roles: ['admin', 'dokter'],
    },
    {
      label: 'Pendaftaran & Antrean',
      href: '/antrean',
      icon: Users,
      badge: activeQueueCount > 0 ? activeQueueCount : undefined,
      badgeColor: 'bg-emerald-500 text-white',
      roles: ['admin'],
    },
    {
      label: 'Rekam Medis (EMR)',
      href: '/rekam-medis',
      icon: FileText,
      highlight: role === 'dokter',
      roles: ['dokter', 'admin'],
    },
    {
      label: 'Kasir & Pembayaran',
      href: '/kasir',
      icon: CreditCard,
      roles: ['admin'],
    },
    {
      label: 'Master Data Obat',
      href: '/master/obat',
      icon: Pill,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
      roles: ['admin'],
    },
    {
      label: 'Tarif Tindakan',
      href: '/master/tarif',
      icon: Activity,
      roles: ['admin'],
    },
    {
      label: 'Laporan & Rekap',
      href: '/laporan',
      icon: BarChart3,
      roles: ['admin', 'dokter'],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 hidden lg:flex flex-col border-r border-slate-800 shrink-0 min-h-[calc(100vh-4rem)]">
      {/* User Status Card */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
            {role === 'admin' ? 'ADM' : 'DR'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">
              {role === 'admin' ? 'Petugas Kasir / Admin' : 'dr. Hendra Pratama'}
            </p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium capitalize">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Mode {role} Active
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-3 space-y-1 flex-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Menu Navigasi
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isRolePrimary = item.roles.includes(role);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group',
                isActive
                  ? 'bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-950/40'
                  : isRolePrimary
                  ? 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                  : 'opacity-60 hover:opacity-100 hover:bg-slate-800/40 text-slate-400'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm',
                    item.badgeColor || 'bg-slate-700 text-slate-200'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Low Stock Footer Warning if applicable */}
      {lowStockCount > 0 && (
        <div className="p-3 m-3 bg-rose-950/40 border border-rose-800/60 rounded-xl">
          <div className="flex items-start gap-2 text-rose-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <p className="text-xs font-semibold">Peringatan Stok!</p>
              <p className="text-[11px] text-rose-300/80 mt-0.5">
                Ada {lowStockCount} obat mendekati/dibawah batas minimal stok.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
