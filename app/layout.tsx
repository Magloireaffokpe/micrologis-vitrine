import type { Metadata } from "next";
import "./globals.css";
import { getConfig, getCategories, getProducts } from "@/lib/products";
import RootLayoutClient from "@/components/layout/RootLayoutClient";
import JsonLd from "@/components/seo/JsonLd";

const config = getConfig();
const BASE_URL = "https://micrologis.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `MICROLOGIS Parakou — Ordinateurs, Téléphones & Accessoires au Bénin`,
    template: `%s | MICROLOGIS Parakou`,
  },
  description: `MICROLOGIS est votre boutique informatique et GSM à Parakou, Bénin. Achetez ordinateurs portables, téléphones, tablettes et accessoires neufs ou d'occasion avec garantie. Réparation PC, téléphones et création de sites web. Appelez le ${config.phone}.`,
  keywords: [
    // Ordinateurs
    "ordinateur Parakou", "PC Parakou", "ordinateur portable Bénin", "acheter PC Parakou",
    "prix ordinateur Parakou", "HP Parakou", "Dell Parakou", "Lenovo Parakou",
    // Téléphones
    "téléphone Parakou", "smartphone Parakou", "iPhone Parakou", "Samsung Parakou",
    "acheter téléphone Parakou", "prix téléphone Bénin", "Infinix Parakou", "Tecno Parakou",
    // Tablettes
    "tablette Parakou", "iPad Parakou", "tablette étudiant Bénin",
    // Accessoires
    "accessoires informatiques Parakou", "clé USB Parakou", "souris sans fil Parakou",
    // Réparation & maintenance
    "réparation PC Parakou", "réparation téléphone Parakou", "maintenance informatique Bénin",
    "dépannage informatique Parakou", "réparation écran téléphone Parakou",
    // Développement web
    "développeur web Parakou", "création site web Parakou", "site vitrine Parakou",
    "développement web Bénin", "agence web Parakou", "application web Bénin",
    // Marque & localisation
    "MICROLOGIS", "informatique Parakou", "GSM Parakou", "BANIKANNI",
    "magasin informatique Bénin", "high tech Parakou", "boutique informatique Bénin",
  ],
  authors: [{ name: "MICROLOGIS", url: BASE_URL }],
  creator: "MICROLOGIS",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: BASE_URL,
    siteName: "MICROLOGIS Parakou",
    title: "MICROLOGIS Parakou — Ordinateurs, Téléphones & Accessoires au Bénin",
    description: `Boutique high-tech à Parakou, Bénin. PC portables, smartphones, tablettes, accessoires. Neuf & occasion avec garantie. Réparation informatique & développement web. ${config.phone}`,
    images: [{ url: "/images/hero/hero-banner.webp", width: 1200, height: 630, alt: "MICROLOGIS Parakou — Boutique Informatique & GSM" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MICROLOGIS Parakou — High-Tech au Bénin",
    description: "PC portables, smartphones, tablettes, accessoires & développement web à Parakou. Réparation informatique.",
    images: ["/images/hero/hero-banner.webp"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  other: {
    "geo.region": "BJ-BO",
    "geo.placename": "Parakou, Bénin",
    "geo.position": "9.3370;2.6280",
    "ICBM": "9.3370, 2.6280",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = getCategories();
  const products = getProducts();

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#business`,
    "name": "MICROLOGIS INFORMATIQUE & GSM",
    "alternateName": "MICROLOGIS Parakou",
    "description": "Boutique informatique et GSM à Parakou, Bénin. Vente de PC, téléphones, tablettes, accessoires neufs et occasion. Réparation informatique et développement web.",
    "url": BASE_URL,
    "telephone": config.phone,
    "email": config.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "BANIKANNI, après le pont, 2ème immeuble à droite (pavé Campus → Rose Croix)",
      "addressLocality": "Parakou",
      "addressCountry": "BJ",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 9.3370,
      "longitude": 2.6280,
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "08:00",
        "closes": "18:00",
      },
    ],
    "image": `${BASE_URL}/images/hero/hero-banner.webp`,
    "logo": `${BASE_URL}/images/logo/logo.webp`,
    "priceRange": "FCFA",
    "currenciesAccepted": "XOF",
    "paymentAccepted": "Cash, Mobile Money (MTN MoMo, Moov Money, Orange Money)",
    "sameAs": [config.social.facebook],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Catalogue MICROLOGIS",
      "itemListElement": categories.map((cat) => ({
        "@type": "OfferCatalog",
        "name": cat.name,
        "url": `${BASE_URL}/${cat.slug}`,
      })),
    },
    "areaServed": {
      "@type": "City",
      "name": "Parakou",
      "containedInPlace": {
        "@type": "Country",
        "name": "Bénin",
      },
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "name": "MICROLOGIS Parakou",
    "url": BASE_URL,
    "description": "Boutique informatique & GSM à Parakou — PC, téléphones, tablettes, réparation, développement web",
    "inLanguage": "fr-FR",
    "publisher": { "@id": `${BASE_URL}/#business` },
  };

  return (
    <html lang="fr">
      <body className="font-body antialiased text-brand-dark">
        <JsonLd data={localBusinessSchema} />
        <JsonLd data={websiteSchema} />
        <RootLayoutClient config={config} categories={categories} products={products}>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
