"use client";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

interface WhatsAppCTAProps {
  href: string;
}

export default function WhatsAppCTA({ href }: WhatsAppCTAProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="Contacter sur WhatsApp"
      className="fixed bottom-6 right-5 z-50 w-14 h-14 bg-whatsapp text-white rounded-full
                 flex items-center justify-center shadow-lg hover:scale-110 transition-transform
                 md:bottom-6 bottom-[74px]"
      aria-label="Contacter MICROLOGIS sur WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
}
