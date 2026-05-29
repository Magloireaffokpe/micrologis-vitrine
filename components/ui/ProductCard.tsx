import Image from "next/image";
import { Product, StoreConfig } from "@/types";
import { buildProductLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { Laptop, Smartphone, Tablet, Headphones, Mouse, Wrench, Package } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  ordinateurs: <Laptop size={40} className="text-gray-200" />,
  telephones: <Smartphone size={40} className="text-gray-200" />,
  tablettes: <Tablet size={40} className="text-gray-200" />,
  "accessoires-gsm": <Headphones size={40} className="text-gray-200" />,
  "accessoires-informatiques": <Mouse size={40} className="text-gray-200" />,
  services: <Wrench size={40} className="text-gray-200" />,
};

const conditionColors: Record<string, string> = {
  new: "bg-brand-blue text-white",
  occasion: "bg-amber-500 text-white",
  reconditioned: "bg-purple-600 text-white",
};
const conditionLabels: Record<string, string> = {
  new: "Neuf",
  occasion: "Occasion",
  reconditioned: "Reconditionné",
};

interface ProductCardProps {
  product: Product;
  config: StoreConfig;
}

export default function ProductCard({ product, config }: ProductCardProps) {
  const waLink = buildProductLink(product, config);
  const hasImage = product.images.length > 0;

  return (
    <div className="group flex flex-col bg-white border border-[#E5E9EF] rounded-brand overflow-hidden hover:border-brand-blue/40 hover:shadow-brand-hover transition-all duration-200">
      {/* Image area */}
      <div className="relative bg-surface aspect-[4/3] flex items-center justify-center overflow-hidden border-b border-[#E5E9EF]">
        {hasImage ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            {categoryIcons[product.category_id] ?? <Package size={40} className="text-gray-200" />}
          </div>
        )}
        {/* Condition badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] ${conditionColors[product.condition]}`}>
            {conditionLabels[product.condition]}
          </span>
          {!product.in_stock && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] bg-red-100 text-red-600">
              Rupture
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3">
        <h3 className="text-[13px] font-semibold text-brand-dark leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>
        {/* Specs — compact tech display */}
        {product.specs && (
          <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mb-2">
            {product.specs}
          </p>
        )}

        <div className="mt-auto pt-2 border-t border-[#F0F2F5] flex items-center justify-between gap-2">
          <div>
            <span className="text-[15px] font-black text-brand-dark leading-none">
              {product.price?.toLocaleString("fr-FR")}
            </span>
            <span className="text-[11px] text-gray-400 ml-0.5">{config.currency_symbol}</span>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-whatsapp text-white text-[10px] font-bold px-2.5 h-7 rounded-brand-sm hover:opacity-85 transition-opacity shrink-0"
          >
            <WhatsAppIcon className="w-3 h-3" />
            <span className="hidden sm:inline">Contacter</span>
          </a>
        </div>
      </div>
    </div>
  );
}
