// app/admin/categories/page.tsx
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import type { Category } from '@/types';
import CategoryManager from '@/components/admin/CategoryManager';

export const metadata = { title: 'Catégories' };
export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('[AdminCategoriesPage] Erreur Supabase:', error.message);
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-semibold mb-2">Erreur lors du chargement des catégories</p>
        <p className="text-sm text-gray-400">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <CategoryManager initialCategories={(data ?? []) as Category[]} />
    </div>
  );
}
