// types/index.ts — VERSION ÉTENDUE POUR SUPABASE
// Ce fichier REMPLACE l'actuel types/index.ts
// Il conserve toutes les interfaces existantes et en ajoute de nouvelles

// ─── Types existants (INCHANGÉS) ──────────────────────────────────────────────

export interface StoreConfig {
  store_name: string;
  tagline: string;
  whatsapp_number: string;
  whatsapp_message_generic: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  maps_link: string;
  maps_embed_url: string;
  currency: string;
  currency_symbol: string;
  logo_path: string;
  hours: Record<string, string>;
  social: {
    facebook: string;
    instagram: string;
  };
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  name_short: string;
  description: string;
  icon: string;
  color: string;
  bg_color: string;
  meta_title: string;
  meta_description: string;
  subcategories: string[];
  // Champs Supabase (optionnels, absents dans l'ancien JSON)
  sort_order?: number;
  is_active?: boolean;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  subcategory: string;
  description: string;
  specs: string;
  price: number | null;
  price_original: number | null;
  condition: 'new' | 'occasion' | 'reconditioned';
  in_stock: boolean;
  images: string[];
  whatsapp_message: string | null;
  // "featured" dans l'ancien JSON, "is_featured" dans Supabase — les deux supportés
  featured?: boolean;
  is_featured?: boolean;
  tags: string[];
  // Champs Supabase (optionnels)
  is_active?: boolean;
  is_promo?: boolean;
  price_promo?: number | null;
  promo_start?: string | null;
  promo_end?: string | null;
  stock_qty?: number | null;
  category?: Pick<Category, 'id' | 'name' | 'slug'> | null;
  reviews?: Review[];
  effective_price?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductsData {
  config: StoreConfig;
  categories: Category[];
  products: Product[];
}

// ─── Nouveaux types pour Supabase ─────────────────────────────────────────────

export type ProductCondition = 'new' | 'occasion' | 'reconditioned';
export type QuoteStatus = 'pending' | 'processed' | 'cancelled';

export interface Quote {
  id: string;
  product_id?: string | null;
  product_name?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  status: QuoteStatus;
  admin_note?: string | null;
  created_at: string;
  updated_at: string;
  product?: Pick<Product, 'id' | 'name' | 'slug'> | null;
}

export interface Review {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  comment?: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image?: string | null;
  is_published: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  inStock?: boolean;
  featured?: boolean;
  promo?: boolean;
  limit?: number;
  page?: number;
  pageSize?: number;
}
