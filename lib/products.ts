// lib/products.ts — VERSION DYNAMIQUE (Supabase)
// Remplace l'ancien fichier qui lisait public/data/products.json
//
// ⚠️  Les signatures des fonctions publiques sont CONSERVÉES à l'identique
//     pour ne pas casser les imports existants dans les composants et pages.
//     Seule l'implémentation change : lecture Supabase au lieu du JSON statique.
//
// IMPORTANT : ces fonctions sont async (Supabase est async).
// Les pages et composants qui les appellent doivent être des Server Components
// ou passer par des API Routes.

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getEffectivePrice } from '@/lib/utils';
import type {
  Category,
  Product,
  StoreConfig,
  ProductFilters,
  PaginatedResponse,
} from '@/types';

type ServerSupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

// ─── Config / Settings ────────────────────────────────────────────────────────

/**
 * Charge les paramètres de la boutique depuis la table `settings`.
 * Retourne un objet StoreConfig compatible avec l'existant.
 */
export async function getConfig(supabaseParam?: ServerSupabaseClient): Promise<StoreConfig> {
  const supabase = supabaseParam ?? (await createServerSupabaseClient());
  const { data } = await supabase.from('settings').select('key, value');

  // Construire un Record<key, value>
  const raw: Record<string, string> = {};
  (data ?? []).forEach((s: { key: string; value: string | null }) => {
    raw[s.key] = s.value ?? '';
  });

  let legacyHours: Record<string, string> | null = null;
  if (raw.hours) {
    try {
      const parsed = JSON.parse(raw.hours);
      if (parsed && typeof parsed === 'object') {
        legacyHours = parsed as Record<string, string>;
      }
    } catch {
      legacyHours = null;
    }
  }

  const hoursWeek =
    raw.hours_semaine ||
    raw['Lun – Sam'] ||
    legacyHours?.['Lun – Sam'] ||
    '08h00 – 21h00';
  const hoursSunday =
    raw.hours_dimanche ||
    raw['Dimanche'] ||
    legacyHours?.['Dimanche'] ||
    'Fermé';

  // Reconstituer la structure StoreConfig attendue par les composants
  return {
    store_name: raw.store_name ?? 'MICROLOGIS INFORMATIQUE & GSM',
    tagline: raw.tagline ?? 'Votre boutique high-tech à Parakou',
    whatsapp_number: raw.whatsapp_number ?? '',
    whatsapp_message_generic:
      raw.whatsapp_message_generic ??
      'Bonjour MICROLOGIS, je voudrais avoir des informations.',
    phone: raw.phone ?? '',
    email: raw.email ?? '',
    address: raw.address ?? '',
    city: raw.city ?? 'Parakou',
    maps_link: raw.maps_link ?? '',
    maps_embed_url: raw.maps_embed_url ?? '',
    currency: raw.currency ?? 'XOF',
    currency_symbol: raw.currency_symbol ?? 'FCFA',
    logo_path: raw.logo_path ?? '/images/logo/logo.webp',
    hours: {
      'Lun – Sam': hoursWeek,
      'Dimanche': hoursSunday,
    },
    social: {
      facebook: raw.social_facebook ?? '',
      instagram: raw.social_instagram ?? '',
    },
  };
}

// ─── Catégories ───────────────────────────────────────────────────────────────

export async function getCategories(activeOnly = true, supabaseParam?: ServerSupabaseClient): Promise<Category[]> {
  const supabase = supabaseParam ?? (await createServerSupabaseClient());
  let query = supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (activeOnly) query = query.eq('is_active', true);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalizeCategory);
}

export async function getCategoryBySlug(slug: string, supabaseParam?: ServerSupabaseClient): Promise<Category | undefined> {
  const supabase = supabaseParam ?? (await createServerSupabaseClient());
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error || !data) return undefined;
  return normalizeCategory(data);
}

/** Retourne les slugs de toutes les catégories actives (pour generateStaticParams) */
export async function getAllSlugs(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('categories')
    .select('slug')
    .eq('is_active', true);
  return (data ?? []).map((c: { slug: string }) => c.slug);
}

// ─── Produits ─────────────────────────────────────────────────────────────────

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();
  const query = supabase
    .from('products')
    .select('*, category:categories(id,name,slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(filters.limit ?? 200);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalizeProduct);
}

export async function getProductsPaginated(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> {
  const supabase = await createServerSupabaseClient();
  const {
    category,
    search,
    minPrice,
    maxPrice,
    condition,
    inStock,
    featured,
    promo,
    page = 1,
    pageSize = 12,
  } = filters;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('products')
    .select('*, category:categories(id,name,slug)', { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();
    if (cat) query = query.eq('category_id', cat.id);
  }
  if (condition) query = query.eq('condition', condition);
  if (inStock !== undefined) query = query.eq('in_stock', inStock);
  if (featured !== undefined) query = query.eq('is_featured', featured);
  if (promo !== undefined) query = query.eq('is_promo', promo);
  if (minPrice !== undefined) query = query.gte('price', minPrice);
  if (maxPrice !== undefined) query = query.lte('price', maxPrice);
  if (search) query = query.ilike('name', `%${search}%`);
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data: (data ?? []).map(normalizeProduct),
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getProductsByCategory(categoryId: string, supabaseParam?: ServerSupabaseClient): Promise<Product[]> {
  const supabase = supabaseParam ?? (await createServerSupabaseClient());
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalizeProduct);
}

export async function getFeaturedProducts(limit = 8, supabaseParam?: ServerSupabaseClient): Promise<Product[]> {
  const supabase = supabaseParam ?? (await createServerSupabaseClient());
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalizeProduct);
}

export async function getProductBySlug(slug: string, supabaseParam?: ServerSupabaseClient): Promise<Product | undefined> {
  const supabase = supabaseParam ?? (await createServerSupabaseClient());
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), reviews(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (error || !data) return undefined;
  return normalizeProduct(data);
}

export async function getRelatedProducts(product: Product, limit = 4, supabaseParam?: ServerSupabaseClient): Promise<Product[]> {
  const supabase = supabaseParam ?? (await createServerSupabaseClient());
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug)')
    .eq('category_id', product.category_id)
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(limit);
  if (error) return [];
  return (data ?? []).map(normalizeProduct);
}

// ─── Normalisation ────────────────────────────────────────────────────────────

/**
 * Normalise une ligne Supabase en Category compatible avec l'interface existante.
 * Les champs manquants (icon, color, bg_color, etc.) reçoivent des valeurs par défaut.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCategory(row: any): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    name_short: row.name_short ?? row.name,
    description: row.description ?? '',
    icon: row.icon ?? 'Wrench',
    color: row.color ?? '#1B5EC2',
    bg_color: row.bg_color ?? '#EBF2FF',
    meta_title: row.meta_title ?? `${row.name} — MICROLOGIS Parakou`,
    meta_description: row.meta_description ?? row.description ?? '',
    subcategories: row.subcategories
      ? Array.isArray(row.subcategories)
        ? row.subcategories
        : JSON.parse(row.subcategories)
      : [],
    sort_order: row.sort_order ?? 0,
    is_active: row.is_active ?? true,
    image_url: row.image_url ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Normalise une ligne Supabase en Product compatible avec l'interface existante.
 * Le champ `featured` (ancien JSON) est mappé depuis `is_featured` (Supabase).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProduct(row: any): Product {
  const effective = getEffectivePrice(row as Product);
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category_id: row.category_id ?? '',
    subcategory: row.subcategory ?? '',
    description: row.description ?? '',
    specs: row.specs ?? '',
    price: row.price,
    price_original: row.price_original ?? null,
    condition: row.condition ?? 'new',
    in_stock: row.in_stock ?? true,
    images: Array.isArray(row.images) ? row.images : [],
    whatsapp_message: row.whatsapp_message ?? null,
    featured: row.is_featured ?? false,     // rétrocompat
    is_featured: row.is_featured ?? false,
    tags: Array.isArray(row.tags) ? row.tags : [],
    is_active: row.is_active ?? true,
    is_promo: row.is_promo ?? false,
    price_promo: row.price_promo ?? null,
    promo_start: row.promo_start ?? null,
    promo_end: row.promo_end ?? null,
    stock_qty: row.stock_qty ?? null,
    category: row.category ?? null,
    reviews: row.reviews ?? [],
    effective_price: effective,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
