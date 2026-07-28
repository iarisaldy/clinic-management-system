'use client';

import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  FileCheck,
  Menu,
  X,
  ChevronRight,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileHeaderToggle: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden flex items-center justify-center border border-slate-200 dark:border-slate-700"
      aria-label="Toggle Navigation Menu"
    >
      {isOpen ? <X className="w-5 h-5 text-teal-600" /> : <Menu className="w-5 h-5" />}
    </button>
  );
};

export const MobileDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();
  const { medicines, queues, doctorProfile } = useClinic();

  const lowStockCount = medicines.filter((m) => m.stock <= m.min_stock).length;
  const activeQueueCount = queues.filter((q) => q.status === 'menunggu' || q.status === 'pemeriksaan').length;

  useEffect(() => {
    onClose();
  }, [pathname]);

  if (!isOpen) return null;

  const navItems = [
    { label: 'Dashboard Overview', href: '/', icon: LayoutDashboard },
    {
      label: 'Pendaftaran & Antrean',
      href: '/antrean',
      icon: Users,
      badge: activeQueueCount > 0 ? activeQueueCount : undefined,
      badgeColor: 'bg-emerald-500 text-white',
    },
    { label: 'Rekam Medis (EMR)', href: '/rekam-medis', icon: FileText },
    { label: 'Cetak Surat & Rujukan', href: '/surat', icon: FileCheck },
    { label: 'Kasir & Pembayaran', href: '/kasir', icon: CreditCard },
    {
      label: 'Master Data Obat',
      href: '/master/obat',
      icon: Pill,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { label: 'Tarif Layanan Dokter', href: '/master/tarif', icon: Activity },
    { label: 'Laporan & Rekap', href: '/laporan', icon: BarChart3 },
    { label: 'Pengaturan Profil', href: '/settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-slate-900 text-slate-300 shadow-2xl flex flex-col z-10 border-r border-slate-800">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-600/20 text-teal-400 flex items-center justify-center font-bold text-sm border border-teal-500/30">
              DR
            </div>
            <div>
              <p className="text-xs font-bold text-white">{doctorProfile.name}</p>
              <p className="text-[10px] text-teal-400 font-medium">Dokter Praktik Mandiri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="p-3 space-y-1 overflow-y-auto flex-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Menu Utama Praktik
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'hover:bg-slate-800 text-slate-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-slate-400')} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined ? (
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', item.badgeColor)}>
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Credit */}
        <div className="p-3 m-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 font-semibold">© 2026 Developed by</p>
          <p className="text-xs font-bold text-teal-400">Muhammad Irfan</p>
        </div>
      </div>
    </div>
  );
};

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { queues } = useClinic();
  const activeQueueCount = queues.filter((q) => q.status === 'menunggu' || q.status === 'pemeriksaan').length;

  const bottomItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Antrean', href: '/antrean', icon: Users, badge: activeQueueCount > 0 ? activeQueueCount : undefined },
    { label: 'EMR', href: '/rekam-medis', icon: FileText },
    { label: 'Surat', href: '/surat', icon: FileCheck },
    { label: 'Kasir', href: '/kasir', icon: CreditCard },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 lg:hidden px-2 py-1.5 shadow-2xl">
      <div className="grid grid-cols-5 gap-1">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-medium transition-all relative',
                isActive
                  ? 'text-teal-400 bg-teal-950/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <div className="relative">
                <Icon className={cn('w-5 h-5 mb-0.5', isActive ? 'text-teal-400' : 'text-slate-400')} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-emerald-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="truncate w-full text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
