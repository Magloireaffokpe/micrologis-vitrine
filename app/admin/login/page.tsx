// app/admin/login/page.tsx
import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Connexion Admin — MICROLOGIS',
  robots: { index: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="font-head text-3xl font-black">
            <span className="text-brand-blue">MICRO</span>
            <span className="text-white">LOGIS</span>
          </p>
          <p className="text-white/40 text-xs font-bold tracking-widest uppercase mt-1">
            Administration
          </p>
        </div>

        <div className="bg-white rounded-brand-lg shadow-2xl p-8">
          <h1 className="text-xl font-black text-brand-dark mb-1">Connexion</h1>
          <p className="text-sm text-gray-400 mb-6">
            Accès réservé à l&apos;administrateur du site.
          </p>
          <Suspense fallback={<div className="h-40" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
