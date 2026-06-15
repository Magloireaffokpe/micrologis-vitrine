// app/admin/products/new/page.tsx
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';
import type { Category } from '@/types';

export const metadata = { title: 'Nouveau produit' };

export default async function NewProductPage() {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  const categories = (data ?? []) as Category[];

  return (
    <div>
      <h1 className="text-xl font-black text-brand-dark mb-6">Nouveau produit</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
