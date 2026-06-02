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
          {Object.entries(config.hours)
            .filter(([, time]) => time !== "Fermé")
            .map(([day, time], index) => (
              <span key={day} className="flex items-center">
                {index > 0 && <span className="mx-2 opacity-50">|</span>}
                {day.replace("Lundi", "Lun").replace("Samedi", "Sam")} <strong className="opacity-100 ml-1">{time}</strong>
              </span>
            ))}
        </span>
        <span className="flex items-center gap-1.5 opacity-80">
          <Phone size={12} className="text-brand-orange shrink-0" />
          <strong className="text-brand-orange">{config.phone}</strong>
        </span>
      </div>
    </div>
  );
}
