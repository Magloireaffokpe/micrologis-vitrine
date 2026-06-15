// app/admin/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';
import type { Category, Product } from '@/types';

export const metadata = { title: 'Modifier le produit' };
export const dynamic = 'force-dynamic';

interface Props { params: { id: string } }

export default async function EditProductPage({ params }: Props) {
  const supabase = createAdminSupabaseClient();

  const [{ data: product }, { data: cats }] = await Promise.all([
    supabase.from('products').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
  ]);

  if (!product) notFound();

  const p = product as Product;

  return (
    <div>
      <h1 className="text-xl font-black text-brand-dark mb-1">Modifier le produit</h1>
      <p className="text-sm text-gray-400 mb-6 font-mono">{p.slug}</p>
      <ProductForm product={p} categories={(cats ?? []) as Category[]} />
    </div>
  );
}
