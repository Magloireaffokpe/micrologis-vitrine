"use client";
import { useRef, useEffect } from "react";
import { Search, X, Laptop, Smartphone, Tablet, Headphones, Mouse, Wrench } from "lucide-react";
import { Product, StoreConfig } from "@/types";
import { useSearch } from "@/hooks/useSearch";
import { buildProductLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";

interface SearchBarProps {
  products: Product[];
  config: StoreConfig;
  className?: string;
}

export default function SearchBar({ products, config, className = "" }: SearchBarProps) {
  const { query, results, isOpen, handleQuery, close } = useSearch(products);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [close]);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQuery(e.target.value)}
          placeholder="Rechercher un produit, une marque…"
          className="w-full h-10 bg-gray-50 border border-gray-200 rounded-brand pl-9 pr-9 text-sm text-brand-dark
                     outline-none focus:border-brand-blue focus:bg-white transition-colors"
          aria-label="Rechercher des produits"
          
          aria-haspopup="listbox"
        />
        {query && (
          <button
            onClick={close}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark"
            aria-label="Effacer la recherche"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute top-[46px] left-0 right-0 bg-white border border-gray-200 rounded-brand shadow-brand-hover z-50 max-h-80 overflow-y-auto"
        >
          {results.map((product) => (
            <a
              key={product.id}
              href={buildProductLink(product, config)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              role="option" aria-selected="false"
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-brand-blue-pale transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-300 text-xl">
                {product.category_id === "ordinateurs" ? <Laptop size={14} className="text-gray-400" /> :
                 product.category_id === "telephones" ? <Smartphone size={14} className="text-gray-400" /> :
                 product.category_id === "tablettes" ? <Tablet size={14} className="text-gray-400" /> :
                 product.category_id === "accessoires-gsm" ? <Headphones size={14} className="text-gray-400" /> :
                 product.category_id === "accessoires-informatiques" ? <Mouse size={14} className="text-gray-400" /> : <Wrench size={14} className="text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-brand-dark line-clamp-1">{product.name}</p>
                <p className="text-[11px] text-gray-400">{product.subcategory}</p>
              </div>
              <span className="text-sm font-bold text-brand-blue shrink-0">
                {formatPrice(product.price, config)}
              </span>
            </a>
          ))}
          {results.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-400">Aucun résultat pour « {query} »</p>
          )}
          {results.length > 0 && (
            <div className="border-t border-gray-100 px-3 py-2">
              <button
                onClick={close}
                className="text-xs font-semibold text-brand-orange hover:underline"
              >
                Voir tous les résultats pour « {query} » →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
