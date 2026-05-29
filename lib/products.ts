import { ProductsData, Category, Product, StoreConfig } from "@/types";
import productsData from "@/public/data/products.json";

const data = productsData as ProductsData;

export function getConfig(): StoreConfig {
  return data.config;
}

export function getCategories(): Category[] {
  return data.categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return data.categories.find((c) => c.slug === slug);
}

export function getProducts(): Product[] {
  return data.products;
}

export function getProductsByCategory(categoryId: string): Product[] {
  return data.products.filter((p) => p.category_id === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return data.products.filter((p) => p.featured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return data.products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return data.products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, limit);
}

export function getAllSlugs(): string[] {
  return data.categories.map((c) => c.slug);
}

