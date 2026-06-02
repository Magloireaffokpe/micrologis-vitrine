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
  condition: "new" | "occasion" | "reconditioned";
  in_stock: boolean;
  images: string[];
  whatsapp_message: string | null;
  featured: boolean;
  tags: string[];
}

export interface ProductsData {
  config: StoreConfig;
  categories: Category[];
  products: Product[];
}


