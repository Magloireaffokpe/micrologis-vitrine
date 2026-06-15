'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { Product, StoreConfig } from '@/types';
import { useSearch } from '@/hooks/useSearch';
import { buildProductLink } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/utils';

interface Props {
  products: Product[];
  config: StoreConfig;
  onClose: () => void;
}

export default function MobileSearchOverlay({ products, config, onClose }: Props) {
  const { query, results, handleQuery, close: closeSearch } = useSearch(products);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function handleClose() {
    closeSearch();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-white md:hidden flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="flex-1 relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            placeholder="Rechercher un produit…"
            className="w-full h-11 bg-gray-50 border border-gray-200 rounded-brand pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:bg-white transition-colors"
          />
        </div>
        <button onClick={handleClose} className="text-sm font-semibold text-brand-blue shrink-0">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {query && results.length === 0 && (
          <p className="px-4 py-8 text-sm text-gray-400 text-center">
            Aucun résultat pour « {query} »
          </p>
        )}
        {query && results.length > 0 && (
          <div className="divide-y divide-gray-50">
            {results.map((product) => (
              <a
                key={product.id}
                href={buildProductLink(product, config)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-brand shrink-0 overflow-hidden">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                      ?
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-dark line-clamp-1">{product.name}</p>
                  {product.specs && (
                    <p className="text-xs text-gray-400 line-clamp-1">{product.specs}</p>
                  )}
                </div>
                <span className="text-sm font-bold text-brand-blue shrink-0">
                  {formatPrice(product.price, config)}
                </span>
              </a>
            ))}
          </div>
        )}
        {!query && (
          <p className="px-4 py-8 text-sm text-gray-400 text-center">
            Tapez le nom d&apos;un produit ou d&apos;une marque pour commencer la recherche.
          </p>
        )}
      </div>
    </div>
  );
}