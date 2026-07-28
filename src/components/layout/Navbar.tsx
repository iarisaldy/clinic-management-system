'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/store/ClinicContext';
import { Stethoscope, Clock } from 'lucide-react';
import { MobileHeaderToggle, MobileDrawer } from './MobileNav';

export const Navbar: React.FC = () => {
  const { doctorProfile } = useClinic();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between transition-colors">
        {/* Clinic Brand & Mobile Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <MobileHeaderToggle isOpen={isMobileOpen} onToggle={() => setIsMobileOpen(!isMobileOpen)} />

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 shrink-0">
            <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white truncate">
                {doctorProfile.clinic_name}
              </h1>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {doctorProfile.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
              Sistem Informasi Praktik Dokter & Rekam Medis Mandiri
            </p>
          </div>
        </div>

        {/* Right Controls & Date Display */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Date Display */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{currentDate}</span>
          </div>

          {/* Solo Practice Status Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800 text-[11px] sm:text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden xs:inline">Praktik Mandiri Ready</span>
            <span className="xs:hidden">Ready</span>
          </div>
        </div>
      </header>

      {/* Mobile Side Drawer Overlay */}
      <MobileDrawer isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
};


