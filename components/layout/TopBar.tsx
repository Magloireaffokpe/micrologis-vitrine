import { MapPin, Clock, Phone } from "lucide-react";
import { StoreConfig } from "@/types";

interface TopBarProps {
  config: StoreConfig;
}

export default function TopBar({ config }: TopBarProps) {
  return (
    <div className="bg-brand-dark text-white text-xs py-1.5 px-4 hidden md:block">
      <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-6 flex-wrap">
        <span className="flex items-center gap-1.5 opacity-80">
          <MapPin size={12} className="text-brand-orange shrink-0" />
          {config.city} — BANIKANNI
        </span>
        <span className="flex items-center gap-1.5 opacity-80">
          <Clock size={12} className="text-brand-orange shrink-0" />
          Lun–Ven <strong className="opacity-100 ml-1">08h–19h</strong> &nbsp;|&nbsp; Sam <strong className="opacity-100">08h–18h</strong>
        </span>
        <span className="flex items-center gap-1.5 opacity-80">
          <Phone size={12} className="text-brand-orange shrink-0" />
          <strong className="text-brand-orange">{config.phone}</strong>
        </span>
      </div>
    </div>
  );
}
