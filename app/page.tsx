import { getConfig, getCategories, getFeaturedProducts } from "@/lib/products";
import HeroSection from "@/components/sections/HeroSection";
import PromoBanner from "@/components/sections/PromoBanner";
import CategoryGrid from "@/components/sections/CategoryGrid";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ServicesSection from "@/components/sections/ServicesSection";
import WhatsAppBanner from "@/components/sections/WhatsAppBanner";

export default function HomePage() {
  const config = getConfig();
  const categories = getCategories();
  const featured = getFeaturedProducts();

  return (
    <>
      <HeroSection config={config} />
      <PromoBanner />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featured} config={config} />
      <ServicesSection />
      <WhatsAppBanner config={config} />
    </>
  );
}
