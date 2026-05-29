import type { Metadata } from "next";
import "./globals.css";
import { getConfig, getCategories, getProducts } from "@/lib/products";
import RootLayoutClient from "@/components/layout/RootLayoutClient";

const config = getConfig();

export const metadata: Metadata = {
  title: {
    default: `${config.store_name} | ${config.tagline}`,
    template: `%s | MICROLOGIS Parakou`,
  },
  description: `Achetez vos ordinateurs, téléphones, tablettes et accessoires à Parakou, Bénin. Neuf & occasion avec garantie. ${config.phone}`,
  keywords: ["ordinateur parakou", "téléphone parakou", "pc bénin", "micrologis", "informatique bénin"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: config.store_name,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = getCategories();
  const products = getProducts();

  return (
    <html lang="fr">
      <body className="font-body antialiased text-brand-dark">
        <RootLayoutClient config={config} categories={categories} products={products}>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
