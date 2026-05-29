import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Product, StoreConfig } from "@/types";
import ProductCard from "@/components/ui/ProductCard";

interface FeaturedProductsProps {
  products: Product[];
  config: StoreConfig;
}

export default function FeaturedProducts({ products, config }: FeaturedProductsProps) {
  return (
    <section id="produits" className="py-12 px-4 bg-white border-b border-[#E5E9EF]">
      <div className="max-w-[1280px] mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-brand-blue rounded-full" />
            <div>
              <h2 className="font-head text-xl font-black text-brand-dark tracking-tight uppercase">
                Sélection du moment
              </h2>
              <p className="text-[12px] text-gray-400 mt-0.5">Les produits les plus demandés cette semaine</p>
            </div>
          </div>
          <Link
            href="/ordinateurs"
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-brand-blue hover:text-brand-dark transition-colors"
          >
            Voir tout <ChevronRight size={14} />
          </Link>
        </div>

        {/* Dense product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} config={config} />
          ))}
        </div>

        {/* Mobile "Voir tout" */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/ordinateurs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue hover:text-brand-dark transition-colors"
          >
            Voir tout le catalogue <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
