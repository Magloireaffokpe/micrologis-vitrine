// app/[slug]/page.tsx — VERSION DYNAMIQUE
// Remplace l'ancien fichier statique.
// Gère deux types de routes :
//   /[slug]      → page catégorie  (ex: /ordinateurs-portables)
//   /[slug]      → page produit    (ex: /hp-elitebook-840-g8)
// L'ordre de résolution : on cherche d'abord une catégorie, puis un produit.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCategoryBySlug,
  getProductsByCategory,
  getProductBySlug,
  getRelatedProducts,
  getConfig,
  getAllSlugs,
} from "@/lib/products";
import CategoryClient from "@/components/sections/CategoryClient";
import ProductDetail from "@/components/sections/ProductDetail";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { createServerSupabaseClient } from '@/lib/supabase/server';

// ISR : revalider la page toutes les 60 secondes
export const revalidate = 60;

interface Props {
  params: { slug: string };
}

// Pré-générer les slugs connus au build (optionnel — ISR s'en charge aussi)
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createServerSupabaseClient();
  // Essayer catégorie d'abord
  const category = await getCategoryBySlug(params.slug, supabase);
  if (category) {
    return {
      title: category.meta_title,
      description: category.meta_description,
    };
  }
  // Essayer produit
  const product = await getProductBySlug(params.slug, supabase);
  if (product) {
    return {
      title: product.name,
      description: product.description?.slice(0, 160) ?? "",
      openGraph: {
        images: product.images[0] ? [{ url: product.images[0] }] : [],
      },
    };
  }
  return { title: "Page introuvable" };
}

export default async function SlugPage({ params }: Props) {
  const supabase = await createServerSupabaseClient();
  const config = await getConfig(supabase);

  // ─── Page catégorie ───────────────────────────────────────
  const category = await getCategoryBySlug(params.slug, supabase);
  if (category) {
    const products = await getProductsByCategory(category.id, supabase);
    return (
      <>
        <CategoryClient
          products={products}
          config={config}
          category={category}
        />
      </>
    );
  }

  // ─── Page produit ──────────────────────────────────────────
  const product = await getProductBySlug(params.slug, supabase);
  if (product) {
    const related = await getRelatedProducts(product, 4, supabase);
    return (
      <>
        <Breadcrumb
          items={[
            ...(product.category
              ? [
                  {
                    label: product.category.name,
                    href: `/${product.category.slug}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />
        <ProductDetail product={product} related={related} config={config} />
      </>
    );
  }

  notFound();
}
