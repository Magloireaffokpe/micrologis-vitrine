import { Truck, ShieldCheck, Wrench, CreditCard } from "lucide-react";

const items = [
  { icon: Truck, text: "Livraison à Parakou" },
  { icon: ShieldCheck, text: "Garantie incluse" },
  { icon: Wrench, text: "Réparation & SAV" },
  { icon: CreditCard, text: "Paiement à la livraison" },
];

export default function PromoBanner() {
  return (
    <div className="bg-brand-dark border-b border-white/5">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-center flex-wrap divide-x divide-white/10">
          {items.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-white/75 text-[12px] font-medium px-5 py-2.5 hover:text-white transition-colors">
              <Icon size={13} className="text-brand-orange shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
