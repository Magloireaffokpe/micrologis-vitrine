'use client';
// components/ui/QuoteForm.tsx — Formulaire demande de devis
import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import type { Product } from '@/types';

interface Props {
  product: Pick<Product, 'id' | 'name'>;
}

export default function QuoteForm({ product }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          product_id: product.id,
          product_name: product.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
        <p className="font-bold text-brand-dark">Demande envoyée !</p>
        <p className="text-sm text-gray-500 mt-1">
          Nous vous recontacterons rapidement.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-brand">{error}</p>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">
          Nom complet *
        </label>
        <input
          type="text" required
          value={form.name} onChange={(e) => set('name', e.target.value)}
          placeholder="Votre nom"
          className="w-full h-10 border border-gray-200 rounded-brand px-3 text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Email *
          </label>
          <input
            type="email" required
            value={form.email} onChange={(e) => set('email', e.target.value)}
            placeholder="email@exemple.com"
            className="w-full h-10 border border-gray-200 rounded-brand px-3 text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            value={form.phone} onChange={(e) => set('phone', e.target.value)}
            placeholder="+229 00 00 00 00"
            className="w-full h-10 border border-gray-200 rounded-brand px-3 text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">
          Message
        </label>
        <textarea
          value={form.message} onChange={(e) => set('message', e.target.value)}
          rows={3}
          placeholder={`Je suis intéressé par : ${product.name}`}
          className="w-full border border-gray-200 rounded-brand px-3 py-2 text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition-all resize-none"
        />
      </div>

      <button
        type="submit" disabled={loading}
        className="w-full h-10 bg-brand-blue text-white font-bold text-sm rounded-brand flex items-center justify-center gap-2 hover:bg-brand-blue-light transition-colors disabled:opacity-60"
      >
        {loading
          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <Send size={15} />}
        {loading ? 'Envoi…' : 'Envoyer ma demande'}
      </button>
    </form>
  );
}
