import type { Metadata } from "next";
import { getConfig, getCategories, getFeaturedProducts } from "@/lib/products";
import HeroSection from "@/components/sections/HeroSection";
import PromoBanner from "@/components/sections/PromoBanner";
import CategoryGrid from "@/components/sections/CategoryGrid";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ServicesSection from "@/components/sections/ServicesSection";
import WhatsAppBanner from "@/components/sections/WhatsAppBanner";
import JsonLd from "@/components/seo/JsonLd";

const BASE_URL = "https://micrologis.vercel.app";

export const metadata: Metadata = {
  title: "MICROLOGIS Parakou — Boutique Informatique, Téléphones & Développement Web au Bénin",
  description:
    "MICROLOGIS à Parakou, Bénin : achetez des ordinateurs portables HP, Dell, Lenovo, des smartphones Samsung, iPhone, Infinix, des tablettes iPad à prix abordables. Réparation PC & téléphones, développement de sites web et applications. Neuf & occasion avec garantie.",
  alternates: { canonical: BASE_URL },
};

export default function HomePage() {
  const config = getConfig();
  const categories = getCategories();
  const featured = getFeaturedProducts();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Produits vedettes MICROLOGIS Parakou",
    "description": "Sélection de PC portables, smartphones, tablettes et accessoires disponibles chez MICROLOGIS Parakou",
    "url": BASE_URL,
    "numberOfItems": featured.length,
    "itemListElement": featured.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": p.name,
      "description": p.description,
      "url": `${BASE_URL}/${p.category_id}`,
    })),
  };

  const categoryListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Catégories MICROLOGIS",
    "itemListElement": categories.map((cat, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": cat.name,
      "description": cat.description,
      "url": `${BASE_URL}/${cat.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <JsonLd data={categoryListSchema} />
      <HeroSection config={config} />
      <PromoBanner />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featured} config={config} />
      <ServicesSection />
      <WhatsAppBanner config={config} />
    </>
  );
}
