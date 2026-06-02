import type { Metadata } from "next";
import { getConfig } from "@/lib/products";
import { buildGenericLink } from "@/lib/whatsapp";
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import FaqSection from "@/components/sections/FaqSection";
import JsonLd from "@/components/seo/JsonLd";
import { faqs } from "@/lib/faq-data";

const BASE_URL = "https://micrologis.vercel.app";

export const metadata: Metadata = {
  title: "Contact & Localisation — MICROLOGIS Parakou",
  description: "Retrouvez MICROLOGIS à Parakou, BANIKANNI. Téléphone, WhatsApp, horaires, itinéraire et réponses à vos questions fréquentes (FAQ). Contactez-nous pour l'achat de matériel ou une réparation.",
  alternates: { canonical: `${BASE_URL}/contact` },
};

export default function ContactPage() {
  const config = getConfig();
  const waLink = buildGenericLink(config, "Bonjour MICROLOGIS, je voudrais vous contacter.");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 pb-16">
      <JsonLd data={faqSchema} />
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]} />

      <h1 className="font-head text-3xl font-black text-brand-dark mb-1">Contact &amp; Localisation</h1>
      <p className="text-gray-500 mb-8">Retrouvez-nous à Parakou ou contactez-nous directement.</p>

      {/* ── Layout principal ── */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* ── Colonne gauche : infos (2/5) ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Informations */}
          <div className="bg-white border border-gray-100 rounded-brand p-6 shadow-brand">
            <h2 className="font-head font-bold text-brand-dark mb-5 text-sm uppercase tracking-widest text-brand-blue">
              Informations
            </h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-blue-pale flex items-center justify-center shrink-0">
                  <MapPin size={15} className="text-brand-blue" />
                </div>
                <div>
                  <p className="font-semibold text-brand-dark text-sm">Adresse</p>
                  <p className="text-sm text-gray-500 leading-relaxed mt-0.5">{config.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-blue-pale flex items-center justify-center shrink-0">
                  <Phone size={15} className="text-brand-blue" />
                </div>
                <div>
                  <p className="font-semibold text-brand-dark text-sm">Téléphone</p>
                  <a href={`tel:${config.phone}`} className="text-sm text-brand-blue hover:underline font-medium">
                    {config.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-blue-pale flex items-center justify-center shrink-0">
                  <Mail size={15} className="text-brand-blue" />
                </div>
                <div>
                  <p className="font-semibold text-brand-dark text-sm">Email</p>
                  <a href={`mailto:${config.email}`} className="text-sm text-brand-blue hover:underline">
                    {config.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-blue-pale flex items-center justify-center shrink-0">
                  <Clock size={15} className="text-brand-blue" />
                </div>
                <div className="w-full">
                  <p className="font-semibold text-brand-dark text-sm mb-2">Horaires</p>
                  <div className="space-y-1">
                    {Object.entries(config.hours).map(([day, time]) => (
                      <div key={day} className="flex justify-between text-sm gap-4 py-0.5 border-b border-gray-50 last:border-0">
                        <span className="text-gray-500">{day}</span>
                        <span className={time === "Fermé" ? "text-brand-orange font-semibold" : "text-brand-dark font-medium"}>
                          {time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux & WhatsApp */}
          <div className="bg-white border border-gray-100 rounded-brand p-6 shadow-brand">
            <h2 className="font-head font-bold text-brand-dark mb-4 text-sm uppercase tracking-widest text-brand-blue">
              Nous contacter
            </h2>
            <div className="flex flex-col gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-whatsapp text-white text-sm font-semibold py-3 rounded-brand-sm hover:opacity-85 transition-opacity"
              >
                <MessageCircle size={17} /> Contacter sur WhatsApp
              </a>
              <a
                href={config.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#1877F2] text-white text-sm font-semibold py-3 rounded-brand-sm hover:opacity-85 transition-opacity"
              >
                📘 Suivre sur Facebook
              </a>
            </div>
          </div>
        </div>

        {/* ── Colonne droite : Google Maps (3/5) ── */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="bg-white border border-gray-100 rounded-brand shadow-brand overflow-hidden flex-1 min-h-[420px]">
            <div className="bg-brand-dark px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white text-sm font-semibold">
                <MapPin size={15} className="text-brand-orange" />
                MICROLOGIS — Parakou, BANIKANNI
              </div>
              <a
                href={config.maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-white/60 text-xs hover:text-white transition-colors"
              >
                Ouvrir <ExternalLink size={12} />
              </a>
            </div>
            <iframe
              src={config.maps_embed_url}
              title="Localisation MICROLOGIS Parakou"
              width="100%"
              height="100%"
              className="min-h-[380px] border-0 block"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <FaqSection />
    </div>
  );
}
