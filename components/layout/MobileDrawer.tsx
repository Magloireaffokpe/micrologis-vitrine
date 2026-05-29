"use client";
import Link from "next/link";
import { X, MapPin, Phone, Laptop, Smartphone, Tablet, Headphones, Mouse, Wrench } from "lucide-react";
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
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-brand-dark hover:bg-brand-blue-pale hover:text-brand-blue transition-colors"
              >
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: cat.bg_color, color: cat.color }}>
                  {cat.icon === "Laptop" ? <Laptop size={16} /> :
                   cat.icon === "Smartphone" ? <Smartphone size={16} /> :
                   cat.icon === "Tablet" ? <Tablet size={16} /> :
                   cat.icon === "Headphones" ? <Headphones size={16} /> :
                   cat.icon === "Mouse" ? <Mouse size={16} /> : <Wrench size={16} />}
                </span>
                {cat.name}
              </Link>
            ))}
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
