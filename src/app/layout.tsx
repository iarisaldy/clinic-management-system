import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClinicProvider } from '@/lib/store/ClinicContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileBottomNav } from '@/components/layout/MobileNav';
import { AIChatDrawer } from '@/components/ai/AIChatDrawer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Praktik Dokter Mandiri - Light EMR & Sistem Surat Dokter',
  description: 'Aplikasi EMR, Antrean, Rekam Medis & Cetak Surat Kesehatan/Rujukan RS Praktik Dokter Mandiri',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col`}>
        <ClinicProvider>
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl mx-auto w-full pb-20 lg:pb-8">
              {children}
            </main>
          </div>
          <MobileBottomNav />
          <AIChatDrawer />
        </ClinicProvider>
      </body>
    </html>
  );
}

