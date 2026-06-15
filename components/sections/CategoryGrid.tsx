import Link from "next/link";
import { Category } from "@/types";
import { ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";

type IconName = keyof typeof Icons;

interface CategoryGridProps {
  categories: Category[];
  subtitle?: string;
}

export default function CategoryGrid({ categories, subtitle }: CategoryGridProps) {
  return (
    <section id="categories" className="py-12 px-4 bg-surface border-b border-[#E5E9EF]">
      <div className="max-w-[1280px] mx-auto">
        {/* Section header — Materiel.net style */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-brand-orange rounded-full" />
            <div>
              <h2 className="font-head text-xl font-black text-brand-dark tracking-tight uppercase">
                Catégories
              </h2>
              {subtitle && (
                <p className="text-[12px] text-gray-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          <Link
            href="/ordinateurs"
            className="flex items-center gap-1 text-xs font-semibold text-brand-blue hover:text-brand-dark transition-colors"
          >
            Tout voir <ChevronRight size={14} />
          </Link>
        </div>

        {/* Grid — dense, horizontal scroll on mobile */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const Icon = Icons[cat.icon as IconName] as React.ComponentType<{ size?: number; strokeWidth?: number }> | undefined;
            return (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="group flex flex-col items-center text-center p-3 sm:p-4 bg-white rounded-brand border border-[#E5E9EF] hover:border-brand-blue/40 hover:shadow-brand transition-all duration-200"
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-brand-sm flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-200"
                  style={{ background: cat.bg_color, color: cat.color }}
                >
                  {Icon ? <Icon size={24} strokeWidth={1.8} /> : (
                    <span className="text-lg font-black" style={{ color: cat.color }}>
                      {cat.name_short?.[0] ?? '?'}
                    </span>
                  )}
                </div>
                <p className="font-head text-[13px] font-bold text-brand-dark group-hover:text-brand-blue transition-colors leading-tight">
                  {cat.name_short}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
