'use client';
// components/admin/ReviewsManager.tsx
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Star, Check, Trash2 } from 'lucide-react';
import type { Review } from '@/types';

export default function ReviewsManager({ initialReviews }: { initialReviews: (Review & { product?: { name: string; slug: string } | null })[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  const filtered = filter === 'all'
    ? reviews
    : filter === 'approved'
    ? reviews.filter((r) => r.is_approved)
    : reviews.filter((r) => !r.is_approved);

  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  async function approve(id: string) {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_approved: true }),
    });
    if (res.ok) setReviews((prev) => prev.map((r) => r.id === id ? { ...r, is_approved: true } : r));
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cet avis ?')) return;
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (res.ok) setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-8 px-3 rounded-brand text-sm font-semibold border transition-colors ${
              filter === f ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            {f === 'all' ? 'Tous' : f === 'approved' ? 'Approuvés' : `En attente (${pendingCount})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-brand border border-gray-100 p-12 text-center text-gray-400">
            <Star size={32} className="mx-auto mb-3 opacity-30" />
            Aucun avis dans cette catégorie.
          </div>
        )}

        {filtered.map((review) => (
          <div key={review.id} className={`bg-white rounded-brand border p-5 ${review.is_approved ? 'border-gray-100' : 'border-orange-200'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-brand-dark">{review.author_name}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                  {!review.is_approved && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-50 text-brand-orange border border-orange-200">
                      En attente
                    </span>
                  )}
                </div>
                {(review as Review & { product?: { name: string } | null }).product && (
                  <p className="text-xs text-gray-400 mb-2">
                    Produit : {(review as Review & { product?: { name: string } | null }).product!.name}
                  </p>
                )}
                {review.comment && (
                  <p className="text-sm text-gray-600">{review.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">{formatDate(review.created_at)}</p>
              </div>

              <div className="flex gap-2 shrink-0">
                {!review.is_approved && (
                  <button
                    onClick={() => approve(review.id)}
                    className="flex items-center gap-1.5 h-8 px-3 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold rounded-brand hover:bg-emerald-100 transition-colors"
                  >
                    <Check size={14} /> Approuver
                  </button>
                )}
                <button
                  onClick={() => remove(review.id)}
                  className="p-2 text-gray-400 hover:text-red-500 border border-gray-200 rounded-brand hover:border-red-200 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
