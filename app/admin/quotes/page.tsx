// app/admin/quotes/page.tsx
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import type { Quote } from '@/types';
import QuotesList from '@/components/admin/QuotesList';

export const metadata = { title: 'Devis' };
export const dynamic = 'force-dynamic';

export default async function AdminQuotesPage() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('quotes')
    .select('*, product:products(id,name,slug)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[AdminQuotesPage] Erreur Supabase:', error.message);
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-semibold mb-2">Erreur lors du chargement des devis</p>
        <p className="text-sm text-gray-400">{error.message}</p>
      </div>
    );
  }

  return <QuotesList initialQuotes={(data ?? []) as Quote[]} />;
}
