// app/admin/reviews/page.tsx
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import type { Review } from '@/types';
import ReviewsManager from '@/components/admin/ReviewsManager';

export const metadata = { title: 'Avis clients' };
export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*, product:products(id,name,slug)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[AdminReviewsPage] Erreur Supabase:', error.message);
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-semibold mb-2">Erreur lors du chargement des avis</p>
        <p className="text-sm text-gray-400">{error.message}</p>
      </div>
    );
  }

  return <ReviewsManager initialReviews={(data ?? []) as Review[]} />;
}
