// app/layout.tsx — VERSION DYNAMIQUE
// Remplace l'ancien layout qui importait depuis public/data/products.json
// getConfig() et getCategories() sont maintenant async (Supabase)

import "./globals.css";
import type { Metadata } from "next";
import { getConfig, getCategories, getFeaturedProducts } from "@/lib/products";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import RootLayoutClient from "@/components/layout/RootLayoutClient";
import JsonLd from "@/components/seo/JsonLd";
import { Syne, DM_Sans } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

// Revalider toutes les 60 secondes (ISR) — ajuste selon tes besoins
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return {
    title: {
      default: config.store_name,
      template: `%s — ${config.store_name}`,
    },
    description: config.tagline,
    metadataBase: new URL("https://micrologis.vercel.app"),
    openGraph: {
      siteName: config.store_name,
      locale: "fr_FR",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Créer un client Supabase unique pour cette requête et charger uniquement produits mis en avant
  const supabase = await createServerSupabaseClient();
  const [config, categories, products] = await Promise.all([
    getConfig(supabase),
    getCategories(true, supabase),
    getFeaturedProducts(12, supabase),
  ]);

  return (
    <html lang="fr" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: config.store_name,
            description: config.tagline,
            url: "https://micrologis.vercel.app",
          }}
        />
      </head>
      <body>
        <RootLayoutClient
          config={config}
          categories={categories}
          products={products}
        >
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
