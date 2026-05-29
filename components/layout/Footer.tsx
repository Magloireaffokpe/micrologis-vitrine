import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { StoreConfig, Category } from "@/types";
import { buildGenericLink } from "@/lib/whatsapp";

interface FooterProps {
  config: StoreConfig;
  categories: Category[];
}

export default function Footer({ config, categories }: FooterProps) {
  const waLink = buildGenericLink(config);

  return (
    <footer className="bg-brand-dark text-white/70">
      {/* Main footer grid */}
      <div className="max-w-[1280px] mx-auto px-4 pt-10 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Branding */}
          <div>
            <div className="mb-3">
              <p className="font-head text-xl font-black leading-none">
                <span className="text-brand-blue">MICRO</span>
                <span className="text-white">LOGIS</span>
              </p>
              <p className="text-[9px] font-bold tracking-[2.5px] text-white/35 uppercase mt-1">
                Informatique &amp; GSM
              </p>
            </div>
            <p className="text-[13px] leading-relaxed text-white/50 max-w-[220px]">
              Votre boutique high-tech de confiance à Parakou. Matériel neuf et occasion avec garantie.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[2px] text-white mb-3">Catégories</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/${cat.slug}`}
                    className="text-[13px] text-white/55 hover:text-brand-orange transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-orange/60 inline-block shrink-0" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[2px] text-white mb-3">Contact</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-[13px] text-white/55">
                <MapPin size={13} className="text-brand-orange mt-0.5 shrink-0" />
                <span>{config.address}</span>
              </li>
              <li>
                <a href={`tel:${config.phone}`} className="flex items-center gap-2 text-[13px] text-white/55 hover:text-white transition-colors">
                  <Phone size={13} className="text-brand-orange shrink-0" />
                  {config.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${config.email}`} className="flex items-center gap-2 text-[13px] text-white/55 hover:text-white transition-colors">
                  <Mail size={13} className="text-brand-orange shrink-0" />
                  {config.email}
                </a>
              </li>
              <li>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-white/55 hover:text-white transition-colors">
                  <WhatsAppIcon className="w-3.5 h-3.5 text-whatsapp shrink-0" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[2px] text-white mb-3">
              <Clock size={11} className="inline mr-1.5 text-brand-orange" />
              Horaires
            </h4>
            <ul className="space-y-1.5">
              {Object.entries(config.hours).map(([day, time]) => (
                <li key={day} className="flex justify-between gap-4 text-[13px]">
                  <span className="text-white/45">{day}</span>
                  <span className={time === "Fermé" ? "text-brand-orange font-semibold" : "text-white"}>
                    {time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/30">
          <span>© {new Date().getFullYear()} MICROLOGIS — Parakou, Bénin</span>
          <span>Informatique &amp; GSM · Tous droits réservés</span>
        </div>
      </div>
    </footer>
  );
}
