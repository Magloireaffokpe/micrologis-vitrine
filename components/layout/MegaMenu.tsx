import Link from "next/link";
import { Category } from "@/types";
import { ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";

interface MegaMenuProps {
  category: Category;
}

type IconName = keyof typeof Icons;

function DynIcon({ name, size = 14 }: { name: string; size?: number }) {
  const Comp = Icons[name as IconName] as React.ComponentType<{ size?: number; className?: string }> | undefined;
  if (!Comp) return null;
  return <Comp size={size} className="text-brand-blue-light" />;
}

export default function MegaMenu({ category }: MegaMenuProps) {
  return (
    <div className="absolute top-[calc(100%+2px)] left-0 min-w-[300px] max-w-[90vw] bg-white border border-gray-100 rounded-b-brand rounded-r-brand shadow-[0_12px_40px_rgba(30,45,64,0.15)] z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 translate-y-[-6px] group-hover:translate-y-0">
      {/* Header */}
      <div className="bg-brand-blue text-white px-4 py-2.5 rounded-tr-brand">
        <p className="font-head text-xs font-bold uppercase tracking-widest">{category.name}</p>
      </div>

      {/* Sub grid */}
      <div className="grid grid-cols-2 gap-0.5 p-3">
        {category.subcategories.map((sub) => (
          <Link
            key={sub}
            href={`/${category.slug}?sub=${encodeURIComponent(sub)}`}
            className="flex items-center gap-2 px-3 py-2 rounded-brand-sm text-[13px] text-brand-dark-mid font-medium hover:bg-brand-blue-pale hover:text-brand-blue transition-colors"
          >
            <DynIcon name={category.icon} size={14} />
            {sub}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-4 py-2.5">
        <Link
          href={`/${category.slug}`}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-orange hover:gap-2.5 transition-all"
        >
          <ChevronRight size={14} />
          Voir tous les {category.name.toLowerCase()}
        </Link>
      </div>
    </div>
  );
}
