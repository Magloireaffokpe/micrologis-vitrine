import type { Metadata } from "next";
import { getConfig } from "@/lib/products";
import { buildGenericLink } from "@/lib/whatsapp";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Contact & Localisation",
  description: "Retrouvez MICROLOGIS à Parakou, BANIKANNI. Téléphone, WhatsApp, horaires et itinéraire.",
};

export default function ContactPage() {
  const config = getConfig();
  const waLink = buildGenericLink(config, "Bonjour MICROLOGIS, je voudrais vous contacter.");

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]} />

      <h1 className="font-head text-3xl font-black text-brand-dark mb-2">Contact &amp; Localisation</h1>
      <p className="text-gray-500 mb-10">Retrouvez-nous à Parakou ou contactez-nous directement.</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Info card */}
        <div className="space-y-5">
          <div className="bg-white border border-gray-100 rounded-brand p-6 shadow-brand">
            <h2 className="font-head font-bold text-brand-dark mb-4 text-base uppercase tracking-wide">Informations</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-orange mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-brand-dark text-sm">Adresse</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{config.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-dark text-sm">Téléphone</p>
                  <a href={`tel:${config.phone}`} className="text-sm text-brand-blue hover:underline">{config.phone}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-dark text-sm">Email</p>
                  <a href={`mailto:${config.email}`} className="text-sm text-brand-blue hover:underline">{config.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-dark text-sm mb-1">Horaires</p>
                  {Object.entries(config.hours).map(([day, time]) => (
                    <div key={day} className="flex justify-between text-sm gap-4">
                      <span className="text-gray-500">{day}</span>
                      <span className={time === "Fermé" ? "text-brand-orange font-medium" : "text-brand-dark font-medium"}>{time}</span>
                    </div>
                  ))}
                </div>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="bg-white border border-gray-100 rounded-brand p-6 shadow-brand">
            <h2 className="font-head font-bold text-brand-dark mb-4 text-base uppercase tracking-wide">Réseaux sociaux</h2>
            <div className="flex gap-3">
              <a
                href={config.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#1877F2] text-white text-sm font-semibold px-4 py-2.5 rounded-brand-sm hover:opacity-85 transition-opacity"
              >
                📘 Facebook
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-whatsapp text-white text-sm font-semibold px-4 py-2.5 rounded-brand-sm hover:opacity-85 transition-opacity"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="bg-gray-100 rounded-brand overflow-hidden min-h-[400px] flex items-center justify-center border border-gray-200">
          <div className="text-center text-gray-400 px-8">
            <MapPin size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-brand-dark text-sm mb-1">Parakou, BANIKANNI</p>
            <p className="text-xs leading-relaxed mb-4">
              Le pavé qui quitte le Campus pour Rose Croix,<br/>après le pont, 2ème immeuble à droite.
            </p>
            <a
              href="https://maps.google.com/?q=Parakou+Benin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline"
            >
              Ouvrir dans Google Maps →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
