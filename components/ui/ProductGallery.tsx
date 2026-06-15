'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  images: string[];
  productName: string;
  isPromo?: boolean;
}

export default function ProductGallery({ images, productName, isPromo }: Props) {
  const [current, setCurrent] = useState(0);
  const count = images.length;

  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    }
    if (count > 1) {
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [count, prev, next]);

  const mainImage = count > 0 ? images[current] : null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] bg-surface border border-[#E5E9EF] rounded-brand-lg overflow-hidden flex items-center justify-center group">
        {mainImage ? (
          <>
            <Image
              src={mainImage}
              alt={`${productName} ${count > 1 ? `- ${current + 1}/${count}` : ''}`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {count > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={20} className="text-brand-dark" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                  aria-label="Image suivante"
                >
                  <ChevronRight size={20} className="text-brand-dark" />
                </button>
                <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {current + 1}/{count}
                </span>
              </>
            )}
          </>
        ) : (
          <Package size={64} className="text-gray-200" />
        )}
        {isPromo && (
          <span className="absolute top-3 left-3 bg-brand-orange text-white text-xs font-bold px-2 py-1 rounded-brand-sm z-10">
            PROMO
          </span>
        )}
      </div>

      {/* Miniatures cliquables */}
      {count > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-16 h-16 shrink-0 border-2 rounded-brand overflow-hidden transition-all ${
                i === current ? 'border-brand-blue' : 'border-[#E5E9EF] hover:border-brand-blue/50'
              }`}
            >
              <Image src={img} alt={`${productName} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
