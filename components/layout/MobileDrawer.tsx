"use client";
import Link from "next/link";
import { X, MapPin, Phone, Newspaper } from "lucide-react";
import * as Icons from "lucide-react";
import { usePathname } from "next/navigation";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { StoreConfig, Category } from "@/types";
import { buildGenericLink } from "@/lib/whatsapp";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: StoreConfig;
  categories: Category[];
}

export default function MobileDrawer({ isOpen, onClose, config, categories }: MobileDrawerProps) {
  const pathname = usePathname();
  const waLink = buildGenericLink(config);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-brand-dark/50 z-50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu mobile"
      >
        {/* Head */}
        <div className="bg-brand-dark px-4 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-head text-xl font-black">
              <span className="text-brand-blue">MICRO</span>
              <span className="text-white">LOGIS</span>
            </span>
            <span className="text-[9px] font-semibold tracking-[2px] text-white/40 uppercase">Informatique &amp; GSM</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1"
            aria-label="Fermer le menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-2">
            <p className="text-[10px] font-bold tracking-[2px] text-gray-400 uppercase px-4 pt-3 pb-2">
              Catégories
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  pathname === `/${cat.slug}`
                    ? 'text-brand-orange bg-[#FFF4ED]'
                    : 'text-brand-dark hover:bg-brand-blue-pale hover:text-brand-blue'
                }`}
              >
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: cat.bg_color, color: cat.color }}>
                  {(() => {
                    const Icon = Icons[cat.icon as keyof typeof Icons] as React.ComponentType<{ size?: number }> | undefined;
                    return Icon ? <Icon size={16} /> : <span className="text-sm font-black">{cat.name_short?.[0] ?? '?'}</span>;
                  })()}
                </span>
                {cat.name}
              </Link>
            ))}
            <div className="my-2 border-t border-gray-100 mx-4" />
            <Link
              href="/blog"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                pathname?.startsWith('/blog')
                  ? 'text-brand-orange bg-[#FFF4ED]'
                  : 'text-brand-dark hover:bg-brand-blue-pale hover:text-brand-blue'
              }`}
            >
              <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-blue-pale text-brand-blue">
                <Newspaper size={16} />
              </span>
              Actualités
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors ${
                pathname === '/contact'
                  ? 'text-brand-orange bg-[#FFF4ED]'
                  : 'text-brand-dark hover:bg-[#FFF4ED] hover:text-brand-orange'
              }`}
            >
              <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FFF4ED] text-brand-orange">
                <MapPin size={16} />
              </span>
              Contact &amp; Localisation
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 space-y-3">
          <p className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={13} className="text-brand-orange shrink-0" />
            {config.address.split("—")[0].trim()}
          </p>
          <p className="flex items-center gap-2 text-xs text-gray-500">
            <Phone size={13} className="text-brand-orange shrink-0" />
            {config.phone}
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-whatsapp text-white text-sm font-semibold py-2.5 rounded-brand-sm hover:opacity-85 transition-opacity"
          >
            <WhatsAppIcon className="w-[18px] h-[18px]" />
            Contacter sur WhatsApp
          </a>
        </div>
      </aside>
    </>
  );
}
