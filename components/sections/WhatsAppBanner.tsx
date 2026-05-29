"use client";
import { StoreConfig } from "@/types";
import { buildGenericLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { MessageSquare, Clock } from "lucide-react";

interface WhatsAppBannerProps {
  config: StoreConfig;
}

export default function WhatsAppBanner({ config }: WhatsAppBannerProps) {
  const waLink = buildGenericLink(config, "Bonjour MICROLOGIS, j'ai une question.");

  return (
    <section className="bg-surface border-y border-[#E5E9EF] py-10 px-4">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white border border-[#E5E9EF] rounded-brand p-6 shadow-brand">
          {/* Left */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-whatsapp/10 rounded-brand-sm flex items-center justify-center shrink-0">
              <WhatsAppIcon className="w-6 h-6 text-whatsapp" />
            </div>
            <div>
              <h3 className="font-head text-lg font-black text-brand-dark mb-1">
                Besoin d&apos;un conseil rapide ?
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Notre équipe vous répond sur WhatsApp. Prix, disponibilité, compatibilité — demandez tout.
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                <Clock size={12} className="text-brand-orange" />
                Réponse en quelques minutes
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="shrink-0">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-whatsapp text-white font-bold text-sm px-6 h-11 rounded-brand-sm hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sm"
            >
              <MessageSquare size={16} />
              Démarrer la conversation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
