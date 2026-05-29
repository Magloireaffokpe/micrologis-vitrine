"use client";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import { StoreConfig, Category, Product } from "@/types";
import TopBar from "./TopBar";
import Header from "./Header";
import MobileDrawer from "./MobileDrawer";
import BottomNav from "./BottomNav";
import Footer from "./Footer";
import WhatsAppCTA from "@/components/ui/WhatsAppCTA";
import { buildGenericLink } from "@/lib/whatsapp";

interface RootLayoutClientProps {
  config: StoreConfig;
  categories: Category[];
  products: Product[];
  children: React.ReactNode;
}

export default function RootLayoutClient({ config, categories, products, children }: RootLayoutClientProps) {
  const { isOpen, open, close } = useMobileMenu();
  const waLink = buildGenericLink(config);

  return (
    <>
      <TopBar config={config} />
      <Header config={config} categories={categories} products={products} onMenuOpen={open} />
      <MobileDrawer isOpen={isOpen} onClose={close} config={config} categories={categories} />
      <main className="min-h-screen pb-[58px] md:pb-0">{children}</main>
      <Footer config={config} categories={categories} />
      <BottomNav />
      <WhatsAppCTA href={waLink} />
    </>
  );
}
