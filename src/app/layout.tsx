import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClinicProvider } from '@/lib/store/ClinicContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Klinik Pratama Sehat - Sistem Informasi Praktik Dokter',
  description: 'Aplikasi Light EMR & Sistem Informasi Manajemen Klinik Praktik Dokter Sederhana',
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
            <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </ClinicProvider>
      </body>
    </html>
  );
}
