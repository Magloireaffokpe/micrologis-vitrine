"use client";
import { useState } from "react";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import { StoreConfig, Category, Product } from "@/types";
import TopBar from "./TopBar";
import Header from "./Header";
import MobileDrawer from "./MobileDrawer";
import BottomNav from "./BottomNav";
import Footer from "./Footer";
import WhatsAppCTA from "@/components/ui/WhatsAppCTA";
import MobileSearchOverlay from "@/components/ui/MobileSearchOverlay";
import { buildGenericLink } from "@/lib/whatsapp";
import { usePathname } from "next/navigation";

interface RootLayoutClientProps {
  config: StoreConfig;
  categories: Category[];
  products: Product[];
  children: React.ReactNode;
}

export default function RootLayoutClient({ config, categories, products, children }: RootLayoutClientProps) {
  const { isOpen, open, close } = useMobileMenu();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const waLink = buildGenericLink(config);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar config={config} />
      <Header config={config} categories={categories} products={products} onMenuOpen={open} currentPath={pathname} />
      <MobileDrawer isOpen={isOpen} onClose={close} config={config} categories={categories} />
      <main className="min-h-screen pb-[58px] md:pb-0">{children}</main>
      <Footer config={config} categories={categories} />
      <BottomNav onSearchOpen={() => setMobileSearchOpen(true)} />
      <WhatsAppCTA href={waLink} />
      {mobileSearchOpen && (
        <MobileSearchOverlay products={products} config={config} onClose={() => setMobileSearchOpen(false)} />
      )}
    </>
  );
}
