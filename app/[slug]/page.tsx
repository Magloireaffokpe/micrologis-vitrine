import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getConfig,
  getCategoryBySlug,
  getProductsByCategory,
  getAllSlugs,
} from "@/lib/products";
import { Laptop, Smartphone, Tablet, Headphones, Mouse, Wrench, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CategoryClient from "@/components/sections/CategoryClient";
import WhatsAppBanner from "@/components/sections/WhatsAppBanner";

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

const iconMap: Record<string, LucideIcon> = {
  Laptop, Smartphone, Tablet, Headphones, Mouse, Wrench,
};

interface PageProps {
  params: { slug: string };
  searchParams: { sub?: string };
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) return {};
  return {
    title: cat.meta_title,
    description: cat.meta_description,
  };
}

export default function CategoryPage({ params }: PageProps) {
  const config = getConfig();
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.id);
  const Icon = iconMap[category.icon];

  return (
    <>
      {/* Category hero — clean, tech style */}
      <div className="py-8 px-4 border-b border-[#E5E9EF] bg-surface">
        <div className="max-w-[1280px] mx-auto">
          <Breadcrumb
            items={[
              { label: "Accueil", href: "/" },
              { label: category.name },
            ]}
          />
          <div className="flex items-center gap-3 mt-3">
            <div
              className="w-12 h-12 rounded-brand flex items-center justify-center"
              style={{ background: category.bg_color, color: category.color, border: `2px solid ${category.color}30` }}
            >
              {Icon ? <Icon size={24} strokeWidth={1.8} /> : <Wrench size={24} strokeWidth={1.8} />}
            </div>
            <div>
              <h1 className="font-head text-2xl md:text-3xl font-black text-brand-dark">{category.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{category.description}</p>
            </div>
            <span className="ml-auto text-sm font-semibold text-gray-400 hidden sm:block">
              {products.length} produit{products.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Pure catalogue grid — no filters, no sort */}
      <CategoryClient
        products={products}
        config={config}
      />

      <WhatsAppBanner config={config} />
    </>
  );
}
