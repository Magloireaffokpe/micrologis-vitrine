import Link from "next/link";
import { LayoutGrid, ShieldCheck, Truck, Wrench, Clock } from "lucide-react";
import { StoreConfig } from "@/types";
import { buildGenericLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

interface HeroSectionProps {
  config: StoreConfig;
}

const trustBadges = [
  { icon: ShieldCheck, label: "Garantie incluse" },
  { icon: Truck, label: "Livraison Parakou" },
  { icon: Wrench, label: "SAV & Réparation" },
  { icon: Clock, label: "Réponse rapide" },
];

export default function HeroSection({ config }: HeroSectionProps) {
  const waLink = buildGenericLink(config, "Bonjour MICROLOGIS, je voudrais voir vos produits.");

  return (
    <section className="relative text-white overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero/hero-banner.webp')" }}
      />
      {/* Dark overlay — heavier on left for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/96 via-brand-dark/82 to-brand-dark/45" />

      <div className="relative max-w-[1280px] mx-auto px-4 py-16 md:py-24 lg:py-28">
        <div className="max-w-[560px]">
          {/* Label */}
          <div className="inline-flex items-center gap-2 bg-brand-orange text-white text-[11px] font-bold px-3 py-1.5 rounded-brand-sm uppercase tracking-widest mb-6">
            ⚡ Informatique &amp; GSM — Parakou, Bénin
          </div>

          {/* Heading */}
          <h1 className="font-head text-4xl sm:text-5xl lg:text-[54px] font-black leading-[1.06] mb-5 tracking-tight">
            Votre boutique<br />
            <span className="text-brand-orange">high-tech</span>{" "}
            <span className="text-white">de confiance</span>
          </h1>

          <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-[460px]">
            {config.tagline || 'PC portables, smartphones, tablettes et accessoires — neufs & occasion. Prix transparents, garantie, livraison à Parakou.'}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/#produits"
              className="inline-flex items-center gap-2 bg-brand-orange text-white font-bold text-sm px-6 h-11 rounded-brand-sm hover:bg-[#cf4f14] transition-colors"
            >
              <LayoutGrid size={16} />
              Voir le catalogue
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white font-bold text-sm px-6 h-11 rounded-brand-sm hover:bg-white/20 transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 text-whatsapp" />
              Nous écrire
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-white/10">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-white/55 text-xs">
                <Icon size={13} className="text-brand-orange shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
