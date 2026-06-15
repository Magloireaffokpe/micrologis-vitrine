// app/admin/products/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { formatPriceCompact, conditionLabel, conditionColor } from '@/lib/utils';
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react';
import type { Product } from '@/types';
import DeleteProductButton from '@/components/admin/DeleteProductButton';

export const metadata = { title: 'Produits' };
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  let products: (Product & { category: { name: string } | null })[] = [];

  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[AdminProductsPage] Erreur Supabase:', error.message);
      return (
        <div className="text-center py-16">
          <p className="text-red-500 font-semibold mb-2">Erreur lors du chargement des produits</p>
          <p className="text-sm text-gray-400">{error.message}</p>
        </div>
      );
    }

    products = (data ?? []) as (Product & { category: { name: string } | null })[];

    if (products.length === 0) {
      console.log('[AdminProductsPage] Aucun produit trouvé — la table products est vide ou la requête n\'a rien retourné');
    } else {
      console.log(`[AdminProductsPage] ${products.length} produit(s) chargé(s)`);
    }
  } catch (err) {
    console.error('[AdminProductsPage] Exception:', err);
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-semibold mb-2">Erreur lors du chargement des produits</p>
        <p className="text-sm text-gray-400">{err instanceof Error ? err.message : 'Erreur inconnue'}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400">{products.length} produit(s)</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 h-9 px-4 bg-brand-blue text-white text-sm font-bold rounded-brand hover:bg-brand-blue-light transition-colors"
        >
          <Plus size={16} /> Nouveau produit
        </Link>
      </div>

      <div className="overflow-x-auto rounded-brand border border-gray-100 bg-white shadow-sm">
        <table className="min-w-[760px] w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Produit</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Catégorie</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Prix</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">État</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  Aucun produit. <Link href="/admin/products/new" className="text-brand-blue font-semibold">Ajouter le premier →</Link>
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.images?.[0] ? (
                      <div className="w-10 h-10 rounded-brand overflow-hidden border border-gray-100 shrink-0">
                        <Image src={p.images[0]} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-brand bg-gray-100 shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-brand-dark leading-tight">{p.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.category?.name ?? '—'}</td>
                <td className="px-4 py-3 font-bold text-brand-dark">
                  {p.price !== null ? formatPriceCompact(p.price) : <span className="text-gray-400 font-normal">Sur devis</span>}
                  {p.is_promo && p.price_promo && (
                    <span className="ml-1 text-brand-orange text-xs font-bold">PROMO</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${conditionColor(p.condition)}`}>
                    {conditionLabel(p.condition)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold ${p.is_active ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {p.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                    {p.is_active ? 'Publié' : 'Masqué'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="p-1.5 text-gray-400 hover:text-brand-blue transition-colors"
                      title="Modifier"
                    >
                      <Pencil size={15} />
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
