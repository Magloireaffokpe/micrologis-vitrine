// app/page.tsx — VERSION DYNAMIQUE
// Remplace l'ancien page.tsx statique
// Les fonctions sont maintenant async — les données viennent de Supabase

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getConfig, getCategories, getFeaturedProducts } from "@/lib/products";
import HeroSection from "@/components/sections/HeroSection";
import CategoryGrid from "@/components/sections/CategoryGrid";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import PromoBanner from "@/components/sections/PromoBanner";
import ServicesSection from "@/components/sections/ServicesSection";
import WhatsAppBanner from "@/components/sections/WhatsAppBanner";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const [config, categories, featured] = await Promise.all([
    getConfig(supabase),
    getCategories(true, supabase),
    getFeaturedProducts(8, supabase),
  ]);

  return (
    <>
      <HeroSection config={config} />
      <PromoBanner />
      <CategoryGrid categories={categories} subtitle={config.tagline} />
      <FeaturedProducts products={featured} config={config} />
      <ServicesSection />
      <WhatsAppBanner config={config} />
    </>
  );
}
