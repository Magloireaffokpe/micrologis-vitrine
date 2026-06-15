'use client';
// components/admin/AdminSidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Tag, MessageSquare,
  Star, FileText, Settings, LogOut, ExternalLink,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Produits', icon: Package },
  { href: '/admin/categories', label: 'Catégories', icon: Tag },
  { href: '/admin/quotes', label: 'Devis', icon: MessageSquare },
  { href: '/admin/reviews', label: 'Avis clients', icon: Star },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-56 xl:w-60 bg-brand-dark shrink-0 h-screen sticky top-0">
        <div className="px-4 py-5 border-b border-white/[0.06]">
          <p className="font-head text-lg font-black">
            <span className="text-brand-blue">MICRO</span>
            <span className="text-white">LOGIS</span>
          </p>
          <p className="text-[9px] font-bold tracking-[2px] text-white/30 uppercase mt-0.5">
            Administration
          </p>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors ${
                isActive(href, exact)
                  ? 'bg-brand-blue text-white'
                  : 'text-white/55 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] p-4 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[12px] text-white/40 hover:text-white transition-colors"
          >
            <ExternalLink size={13} />
            Voir le site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[12px] text-white/40 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={13} />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        <aside className={`fixed top-0 left-0 h-full w-72 bg-brand-dark text-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="px-4 py-5 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <p className="font-head text-lg font-black">
                <span className="text-brand-blue">MICRO</span>
                <span className="text-white">LOGIS</span>
              </p>
              <p className="text-[9px] font-bold tracking-[2px] text-white/30 uppercase mt-0.5">
                Administration
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Fermer le menu admin"
            >
              ✕
            </button>
          </div>

          <nav className="py-4 overflow-y-auto">
            {navItems.map(({ href, label, icon: Icon, exact }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(href, exact)
                    ? 'bg-brand-blue text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/[0.06] p-4 space-y-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <ExternalLink size={16} />
              Voir le site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-red-400 transition-colors w-full"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
