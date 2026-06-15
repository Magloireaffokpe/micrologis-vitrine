// components/sections/ProductDetail.tsx
import Link from 'next/link';
import type { Product, StoreConfig } from '@/types';
import { buildProductLink } from '@/lib/whatsapp';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import QuoteForm from '@/components/ui/QuoteForm';
import ProductCard from '@/components/ui/ProductCard';
import ReviewSection from '@/components/ui/ReviewSection';
import ProductGallery from '@/components/ui/ProductGallery';
import { Tag, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  product: Product;
  related: Product[];
  config: StoreConfig;
}

const conditionLabels: Record<string, string> = {
  new: 'Neuf',
  occasion: 'Occasion',
  reconditioned: 'Reconditionné',
};
const conditionColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  occasion: 'bg-amber-100 text-amber-700',
  reconditioned: 'bg-purple-100 text-purple-700',
};

export default function ProductDetail({ product, related, config }: Props) {
  const waLink = buildProductLink(product, config);
  const images = product.images?.length ? product.images : [];

  const effectivePrice = product.effective_price ?? product.price;

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Fiche produit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <ProductGallery images={images} productName={product.name} isPromo={product.is_promo} />

        {/* Infos produit */}
        <div className="flex flex-col">
          {/* En-tête */}
          <div className="mb-4">
            {product.category && (
              <Link
                href={`/${product.category.slug}`}
                className="text-xs font-semibold text-brand-blue uppercase tracking-wide hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="font-head text-2xl md:text-3xl font-black text-brand-dark mt-1 leading-tight">
              {product.name}
            </h1>
            {product.specs && (
              <p className="text-sm text-gray-500 mt-1">{product.specs}</p>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-brand-sm ${conditionColors[product.condition]}`}>
              {conditionLabels[product.condition]}
            </span>
            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-brand-sm ${product.in_stock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
              {product.in_stock
                ? <><CheckCircle size={12} /> En stock</>
                : <><XCircle size={12} /> Rupture de stock</>}
            </span>
          </div>

          {/* Prix */}
          <div className="mb-6 p-4 bg-surface border border-[#E5E9EF] rounded-brand">
            <div className="flex items-end gap-3 flex-wrap">
              {effectivePrice != null ? (
                <>
                  <span className="text-3xl font-black text-brand-dark break-all">
                    {effectivePrice.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-lg text-gray-500 mb-0.5 shrink-0">{config.currency_symbol}</span>
                </>
              ) : (
                <span className="text-3xl font-black text-gray-400">Prix sur demande</span>
              )}
              {product.is_promo && product.price_promo && product.price != null && (
                <span className="text-base text-gray-400 line-through mb-0.5 shrink-0 w-full sm:w-auto">
                  {product.price.toLocaleString('fr-FR')} {config.currency_symbol}
                </span>
              )}
              {!product.is_promo && product.price_original != null && (
                <span className="text-base text-gray-400 line-through mb-0.5 shrink-0 w-full sm:w-auto">
                  {product.price_original.toLocaleString('fr-FR')} {config.currency_symbol}
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-bold px-6 h-12 rounded-brand hover:opacity-90 transition-opacity"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Commander via WhatsApp
            </a>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="prose prose-sm max-w-none text-gray-600 text-sm leading-relaxed border-t border-[#E5E9EF] pt-4">
              <h3 className="font-semibold text-brand-dark mb-2 text-base">Description</h3>
              <p>{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Formulaire devis + Avis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Demande de devis */}
        <div className="bg-white border border-[#E5E9EF] rounded-brand-lg p-6">
          <h2 className="font-head text-lg font-bold text-brand-dark mb-4">
            Demander un devis
          </h2>
          <QuoteForm product={{ id: product.id, name: product.name }} />
        </div>

        {/* Avis clients */}
        <div className="bg-white border border-[#E5E9EF] rounded-brand-lg p-6">
          <h2 className="font-head text-lg font-bold text-brand-dark mb-4">
            Avis clients
          </h2>
          <ReviewSection productId={product.id} reviews={product.reviews ?? []} />
        </div>
      </div>

      {/* Produits similaires */}
      {related.length > 0 && (
        <section>
          <h2 className="font-head text-xl font-black text-brand-dark mb-4">
            Produits similaires
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} config={config} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
