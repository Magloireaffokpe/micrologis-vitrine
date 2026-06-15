// app/admin/layout.tsx — Layout de toutes les pages admin
// Le middleware gère déjà la redirection si non-authentifié.
// Ce layout ajoute la sidebar et la structure visuelle de l'admin.

import type { Metadata } from 'next';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

export const metadata: Metadata = {
  title: { default: 'Administration — MICROLOGIS', template: '%s | Admin MICROLOGIS' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
