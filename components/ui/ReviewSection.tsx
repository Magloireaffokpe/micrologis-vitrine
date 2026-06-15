'use client';
import { useState, useMemo } from 'react';
import { Star, SendHorizonal, CheckCircle2 } from 'lucide-react';
import type { Review } from '@/types';
import { formatDate } from '@/lib/utils';

interface Props {
  productId: string;
  reviews: Review[];
}

function StarRating({ value, onChange, size = 20 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          disabled={!onChange}
          className="focus:outline-none disabled:cursor-default"
        >
          <Star
            size={size}
            className={
              star <= (hovered || value)
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-200 fill-gray-200'
            }
          />
        </button>
      ))}
    </div>
  );
}

function RatingDistribution({ reviews }: { reviews: Review[] }) {
  const dist = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) counts[5 - r.rating]++; });
    const total = reviews.length || 1;
    return counts.map((c) => ({ count: c, pct: Math.round((c / total) * 100) }));
  }, [reviews]);

  const labels = ['5', '4', '3', '2', '1'];

  return (
    <div className="flex-1 space-y-1">
      {dist.map((d, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="w-3 text-right text-gray-500 text-xs">{labels[i]}</span>
          <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all"
              style={{ width: `${d.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReviewSection({ productId, reviews: initialReviews }: Props) {
  const [reviews] = useState(initialReviews.filter((r) => r.is_approved));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ author_name: '', rating: 0, comment: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews]);

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.rating) { setError('Veuillez sélectionner une note.'); return; }
    setLoading(true); setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, product_id: productId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Rating Summary — Google Play Store style */}
      {reviews.length > 0 && (
        <div className="flex items-start gap-6 mb-6 p-4 bg-gray-50 rounded-brand">
          <div className="text-center min-w-[80px]">
            <div className="text-4xl font-black text-brand-dark leading-none">{avg.toFixed(1)}</div>
            <StarRating value={Math.round(avg)} size={14} />
            <div className="text-xs text-gray-400 mt-1">{reviews.length} avis</div>
          </div>
          <RatingDistribution reviews={reviews} />
        </div>
      )}

      {/* Header + CTA */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-brand-dark">Avis clients</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm font-bold text-brand-blue hover:underline"
          >
            Laisser un avis
          </button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-gray-50 rounded-brand p-5 mb-6 border border-gray-100">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-brand-dark">Merci !</p>
              <p className="text-sm text-gray-500">Votre avis sera visible après modération.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Votre note *</label>
                <StarRating value={form.rating} onChange={(v) => set('rating', v)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Votre nom *</label>
                <input
                  type="text" required
                  value={form.author_name} onChange={(e) => set('author_name', e.target.value)}
                  placeholder="Prénom ou pseudo"
                  className="w-full h-9 border border-gray-200 rounded-brand px-3 text-sm outline-none focus:border-brand-blue transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Commentaire</label>
                <textarea
                  value={form.comment} onChange={(e) => set('comment', e.target.value)}
                  rows={3} placeholder="Votre expérience avec ce produit…"
                  className="w-full border border-gray-200 rounded-brand px-3 py-2 text-sm outline-none focus:border-brand-blue transition-all resize-none"
                />
              </div>
              {error && <p className="text-red-600 text-xs">{error}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={loading}
                  className="flex items-center gap-1.5 h-9 px-4 bg-brand-blue text-white text-sm font-bold rounded-brand hover:bg-brand-blue-light transition-colors disabled:opacity-60">
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <SendHorizonal size={14} />}
                  Envoyer
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="h-9 px-4 bg-white border border-gray-200 text-sm font-bold text-gray-500 rounded-brand hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Liste des avis */}
      <div className="space-y-4">
        {reviews.length === 0 && (
          <p className="text-sm text-gray-400">Aucun avis pour ce produit. Soyez le premier !</p>
        )}
        {reviews.map((review) => (
          <div key={review.id} className="pb-4">
            <StarRating value={review.rating} size={14} />
            {review.comment && (
              <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-brand-dark">{review.author_name}</span>
              <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
