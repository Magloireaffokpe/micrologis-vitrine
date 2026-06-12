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
    default:
      "MICROLOGIS Parakou — Ordinateurs, Téléphones & Accessoires au Bénin",
    template: "%s | MICROLOGIS Parakou",
  },

  description: `Boutique informatique & GSM à Parakou, Bénin. PC portables HP, Dell, Lenovo, smartphones Samsung, iPhone, Infinix, tablettes iPad — neufs & occasion avec garantie. Réparation PC et téléphones. Création de sites web. Appelez le ${config.phone}.`,

  keywords: [
    // Intention d'achat directe — priorité maximale
    "acheter PC Parakou",
    "acheter ordinateur Parakou",
    "prix ordinateur Parakou",
    "acheter téléphone Parakou",
    "prix smartphone Parakou",
    "acheter iPhone Parakou",
    "acheter Samsung Parakou",
    "acheter tablette Parakou",
    "prix iPad Parakou",
    // Marques + ville — ce que les gens tapent vraiment
    "HP Parakou",
    "Dell Parakou",
    "Lenovo Parakou",
    "Samsung Parakou",
    "iPhone Parakou",
    "Infinix Parakou",
    "Tecno Parakou",
    "iPad Parakou",
    // Catégories génériques
    "ordinateur Parakou",
    "PC Parakou",
    "ordinateur portable Bénin",
    "téléphone Parakou",
    "smartphone Parakou",
    "tablette Parakou",
    "accessoires informatiques Parakou",
    "clé USB Parakou",
    "souris sans fil Parakou",
    // Réparation — forte intention locale
    "réparation PC Parakou",
    "réparation téléphone Parakou",
    "réparation écran téléphone Parakou",
    "dépannage informatique Parakou",
    "maintenance informatique Bénin",
    // Développement web
    "développeur web Parakou",
    "création site web Parakou",
    "développement web Bénin",
    "agence web Parakou",
    "application web Bénin",
    // Marque & localisation
    "MICROLOGIS",
    "MICROLOGIS Parakou",
    "informatique Parakou",
    "GSM Parakou",
    "BANIKANNI",
    "magasin informatique Bénin",
    "boutique informatique Bénin",
    "high tech Parakou",
  ],

  authors: [{ name: "MICROLOGIS", url: BASE_URL }],
  creator: "MICROLOGIS",
  publisher: "MICROLOGIS",
  category: "Informatique & Téléphonie",

  // ✅ Favicon
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: BASE_URL,
    siteName: "MICROLOGIS Parakou",
    title:
      "MICROLOGIS Parakou — Ordinateurs, Téléphones & Accessoires au Bénin",
    description: `Boutique high-tech à Parakou, Bénin. PC portables, smartphones, tablettes, accessoires neufs & occasion avec garantie. Réparation informatique & développement web. ${config.phone}`,
    images: [
      {
        url: "/images/hero/hero-banner.webp",
        width: 1200,
        height: 630,
        alt: "MICROLOGIS Parakou — Boutique Informatique & GSM",
        type: "image/webp",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "MICROLOGIS Parakou — High-Tech au Bénin",
    description: `PC portables, smartphones, tablettes, accessoires & développement web à Parakou. ${config.phone}`,
    images: ["/images/hero/hero-banner.webp"],
  },

  alternates: {
    canonical: BASE_URL,
    // ✅ hreflang — site mono-langue français
    languages: {
      fr: BASE_URL,
      "fr-BJ": BASE_URL,
    },
  },

  // ✅ Métadonnées géographiques — crucial pour le SEO local Bénin
  other: {
    "geo.region": "BJ-BO",
    "geo.placename": "Parakou, Bénin",
    "geo.position": "9.3370;2.6280",
    ICBM: "9.3370, 2.6280",
    // ✅ Sécurité — en complément des headers next.config.mjs
    referrer: "strict-origin-when-cross-origin",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = getCategories();
  const products = getProducts();

  // ✅ Schema LocalBusiness enrichi — priorité #1 pour Google Maps & recherche locale
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store", "ComputerStore"],
    "@id": `${BASE_URL}/#business`,
    name: "MICROLOGIS INFORMATIQUE & GSM",
    alternateName: ["MICROLOGIS Parakou", "MICROLOGIS"],
    description:
      "Boutique informatique et GSM à Parakou, Bénin. Vente de PC portables, téléphones, tablettes et accessoires neufs et d'occasion. Réparation informatique et téléphones. Développement de sites web et applications.",
    url: BASE_URL,
    telephone: config.phone,
    email: config.email,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "BANIKANNI, après le pont, 2ème immeuble à droite (pavé Campus → Rose Croix)",
      addressLocality: "Parakou",
      addressRegion: "Borgou",
      addressCountry: "BJ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 9.337,
      longitude: 2.628,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:00",
        closes: "21:00",
      },
    ],
    image: `${BASE_URL}/images/hero/hero-banner.webp`,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/images/logo/logo.webp`,
      width: 200,
      height: 60,
    },
    priceRange: "FCFA",
    currenciesAccepted: "XOF",
    paymentAccepted: "Cash, Mobile Money (MTN MoMo, Moov Money, Orange Money)",
    sameAs: [config.social.facebook],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catalogue MICROLOGIS",
      itemListElement: categories.map((cat) => ({
        "@type": "OfferCatalog",
        name: cat.name,
        url: `${BASE_URL}/${cat.slug}`,
      })),
    },
    areaServed: [
      {
        "@type": "City",
        name: "Parakou",
        containedInPlace: { "@type": "Country", name: "Bénin" },
      },
      {
        "@type": "State",
        name: "Borgou",
        containedInPlace: { "@type": "Country", name: "Bénin" },
      },
    ],
    // ✅ Ajout — services explicitement listés pour les featured snippets
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Vente d'ordinateurs portables neufs et occasion",
          description:
            "HP, Dell, Lenovo, Asus — neufs et occasion avec garantie à Parakou",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Vente de smartphones",
          description:
            "Samsung, iPhone, Infinix, Tecno — neufs et reconditionnés",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Réparation PC et téléphones",
          description:
            "Réparation d'écrans, batteries, claviers, carte mère. Diagnostic gratuit.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Création de sites web",
          description:
            "Sites vitrines, e-commerce et applications web sur mesure à Parakou",
        },
      },
    ],
  };

  // ✅ Schema WebSite avec SearchAction — active la SearchBox dans Google
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "MICROLOGIS Parakou",
    url: BASE_URL,
    description:
      "Boutique informatique & GSM à Parakou — PC, téléphones, tablettes, réparation, développement web",
    inLanguage: "fr-FR",
    publisher: { "@id": `${BASE_URL}/#business` },
    // ✅ Ajout — Sitelinks Searchbox dans les résultats Google
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // ✅ Ajout — BreadcrumbList pour la navigation Google
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: BASE_URL,
      },
      ...categories.map((cat, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: cat.name,
        item: `${BASE_URL}/${cat.slug}`,
      })),
      {
        "@type": "ListItem",
        position: categories.length + 2,
        name: "Contact",
        item: `${BASE_URL}/contact`,
      },
    ],
  };

  return (
    <html lang="fr">
      <head>
        {/* ✅ Préconnexion pour accélérer le chargement — signal de performance pour Google */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-body antialiased text-brand-dark">
        <JsonLd data={localBusinessSchema} />
        <JsonLd data={websiteSchema} />
        <JsonLd data={breadcrumbSchema} />
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
