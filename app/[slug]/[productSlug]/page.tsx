import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getConfig, getProductBySlug, getRelatedProducts } from '@/lib/products';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductDetail from '@/components/sections/ProductDetail';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    slug: string;
    productSlug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createServerSupabaseClient();
  const product = await getProductBySlug(params.productSlug, supabase);
  if (!product) return { title: 'Produit introuvable' };

  return {
    title: product.name,
    description: product.description?.slice(0, 160) ?? 'Fiche produit MICROLOGIS',
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const supabase = await createServerSupabaseClient();
  const config = await getConfig(supabase);
  const product = await getProductBySlug(params.productSlug, supabase);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product, 4, supabase);

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          ...(product.category
            ? [{ label: product.category.name, href: `/${product.category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />
      <ProductDetail product={product} related={related} config={config} />
    </div>
  );
}
