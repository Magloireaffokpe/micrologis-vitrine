'use client';
// components/admin/QuotesList.tsx
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { MessageSquare, Check, X, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Quote, QuoteStatus } from '@/types';

const STATUS_LABELS: Record<QuoteStatus, string> = {
  pending: 'En attente',
  processed: 'Traité',
  cancelled: 'Annulé',
};

const STATUS_COLORS: Record<QuoteStatus, string> = {
  pending: 'bg-orange-50 text-brand-orange border-orange-200',
  processed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-gray-100 text-gray-400 border-gray-200',
};

export default function QuotesList({ initialQuotes }: { initialQuotes: Quote[] }) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<QuoteStatus | 'all'>('all');

  const filtered = filter === 'all' ? quotes : quotes.filter((q) => q.status === filter);
  const counts = {
    all: quotes.length,
    pending: quotes.filter((q) => q.status === 'pending').length,
    processed: quotes.filter((q) => q.status === 'processed').length,
    cancelled: quotes.filter((q) => q.status === 'cancelled').length,
  };

  async function updateStatus(id: string, status: QuoteStatus, admin_note?: string) {
    const res = await fetch(`/api/admin/quotes/${id}`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_note }),
    });
    if (res.ok) {
      setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status, admin_note } : q)));
    }
  }

  async function deleteQuote(id: string) {
    if (!confirm('Supprimer ce devis ?')) return;
    const res = await fetch(`/api/admin/quotes/${id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (res.ok) setQuotes((prev) => prev.filter((q) => q.id !== id));
  }

  return (
    <div>
      {/* Filtres */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'pending', 'processed', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-8 px-3 rounded-brand text-sm font-semibold transition-colors border ${
              filter === f
                ? 'bg-brand-blue text-white border-brand-blue'
                : 'bg-white text-gray-500 border-gray-200 hover:border-brand-blue/30'
            }`}
          >
            {f === 'all' ? 'Tous' : STATUS_LABELS[f]}
            <span className="ml-1.5 font-bold">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-brand border border-gray-100 p-12 text-center text-gray-400">
            <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
            Aucune demande de devis.
          </div>
        )}

        {filtered.map((quote) => (
          <div key={quote.id} className="bg-white rounded-brand border border-gray-100 overflow-hidden">
            {/* En-tête */}
            <div
              className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => setExpanded(expanded === quote.id ? null : quote.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-brand-dark">{quote.name}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${STATUS_COLORS[quote.status]}`}>
                    {STATUS_LABELS[quote.status]}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-0.5 truncate">
                  {quote.product_name ?? 'Produit général'} · {quote.email}
                  {quote.phone && ` · ${quote.phone}`}
                </p>
              </div>
              <div className="text-xs text-gray-400 shrink-0">{formatDate(quote.created_at)}</div>
              {expanded === quote.id ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
            </div>

            {/* Détail */}
            {expanded === quote.id && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                {quote.message && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Message</p>
                    <p className="text-sm text-brand-dark bg-gray-50 rounded-brand p-3">{quote.message}</p>
                  </div>
                )}

                {quote.admin_note && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Note admin</p>
                    <p className="text-sm text-brand-dark">{quote.admin_note}</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {quote.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(quote.id, 'processed')}
                        className="flex items-center gap-1.5 h-8 px-3 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold rounded-brand hover:bg-emerald-100 transition-colors"
                      >
                        <Check size={14} /> Marquer traité
                      </button>
                      <button
                        onClick={() => updateStatus(quote.id, 'cancelled')}
                        className="flex items-center gap-1.5 h-8 px-3 bg-gray-100 text-gray-500 text-sm font-bold rounded-brand hover:bg-gray-200 transition-colors"
                      >
                        <X size={14} /> Annuler
                      </button>
                    </>
                  )}
                  {quote.status !== 'pending' && (
                    <button
                      onClick={() => updateStatus(quote.id, 'pending')}
                      className="flex items-center gap-1.5 h-8 px-3 bg-orange-50 text-brand-orange border border-orange-200 text-sm font-bold rounded-brand hover:bg-orange-100 transition-colors"
                    >
                      Remettre en attente
                    </button>
                  )}
                  <a
                    href={`mailto:${quote.email}?subject=Réponse à votre demande de devis`}
                    className="flex items-center gap-1.5 h-8 px-3 bg-brand-blue text-white text-sm font-bold rounded-brand hover:bg-brand-blue-light transition-colors"
                  >
                    Répondre par email
                  </a>
                  {quote.phone && (
                    <a
                      href={`https://wa.me/${quote.phone.replace(/\s/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 h-8 px-3 bg-whatsapp text-white text-sm font-bold rounded-brand hover:opacity-90 transition-opacity"
                    >
                      WhatsApp
                    </a>
                  )}
                  <button
                    onClick={() => deleteQuote(quote.id)}
                    className="flex items-center gap-1.5 h-8 px-3 text-red-500 border border-red-200 text-sm font-bold rounded-brand hover:bg-red-50 transition-colors ml-auto"
                  >
                    <Trash2 size={14} /> Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
