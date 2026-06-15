'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function setField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Veuillez renseigner votre nom, email et message.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur lors de l’envoi');
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l’envoi');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-8 px-4 rounded-brand bg-emerald-50 border border-emerald-100">
        <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
        <p className="font-bold text-brand-dark">Message envoyé !</p>
        <p className="text-sm text-gray-500 mt-1">Nous vous répondrons rapidement.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Nom *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Votre nom"
            className="w-full h-11 rounded-brand border border-gray-200 px-3 text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="email@exemple.com"
            className="w-full h-11 rounded-brand border border-gray-200 px-3 text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Téléphone</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setField('phone', e.target.value)}
          placeholder="+229 00 00 00 00"
          className="w-full h-11 rounded-brand border border-gray-200 px-3 text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Sujet</label>
        <input
          type="text"
          value={form.subject}
          onChange={(e) => setField('subject', e.target.value)}
          placeholder="Objet de votre message"
          className="w-full h-11 rounded-brand border border-gray-200 px-3 text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Message *</label>
        <textarea
          value={form.message}
          onChange={(e) => setField('message', e.target.value)}
          rows={5}
          placeholder="Décrivez votre demande..."
          className="w-full rounded-brand border border-gray-200 px-3 py-3 text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-brand px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-brand bg-brand-blue text-white text-sm font-bold hover:bg-brand-blue-light transition-colors disabled:opacity-70"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Send size={14} />
        )}
        {loading ? 'Envoi…' : 'Envoyer le message'}
      </button>
    </form>
  );
}
