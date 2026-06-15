'use client';
// components/admin/AdminHeader.tsx
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

const titles: Record<string, string> = {
  '/admin': 'Tableau de bord',
  '/admin/products': 'Produits',
  '/admin/categories': 'Catégories',
  '/admin/quotes': 'Demandes de devis',
  '/admin/reviews': 'Avis clients',
  '/admin/blog': 'Blog / Actualités',
  '/admin/settings': 'Paramètres',
};

interface AdminHeaderProps {
  onMenuOpen: () => void;
}

export default function AdminHeader({ onMenuOpen }: AdminHeaderProps) {
  const pathname = usePathname();

  // Trouver le titre le plus précis
  const title =
    Object.entries(titles)
      .filter(([key]) => pathname.startsWith(key))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? 'Admin';

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3 sm:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          className="inline-flex items-center justify-center w-10 h-10 rounded-brand bg-gray-100 text-brand-dark hover:bg-gray-200 transition-colors lg:hidden"
          aria-label="Ouvrir le menu admin"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-black text-brand-dark">{title}</h1>
      </div>
    </header>
  );
}
