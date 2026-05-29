import { Product, StoreConfig } from "@/types";
import { PackageX } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";

interface CategoryClientProps {
  products: Product[];
  config: StoreConfig;
}

export default function CategoryClient({ products, config }: CategoryClientProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <PackageX size={32} className="text-gray-300" />
        </div>
        <p className="font-semibold text-brand-dark mb-1">Aucun produit disponible</p>
        <p className="text-sm">Revenez bientôt pour découvrir nos nouveautés</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Product count */}
      <p className="text-xs text-gray-400 mb-4 font-medium">
        {products.length} produit{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
      </p>

      {/* Dense product grid — pure catalogue, no filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} config={config} />
        ))}
      </div>
    </div>
  );
}
