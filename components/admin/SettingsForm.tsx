'use client';
// components/admin/SettingsForm.tsx
import { useState } from 'react';
import { Check } from 'lucide-react';

const FIELDS = [
  { key: 'store_name', label: 'Nom de la boutique', type: 'text' },
  { key: 'tagline', label: 'Slogan', type: 'text' },
  { key: 'phone', label: 'Téléphone', type: 'text' },
  { key: 'whatsapp_number', label: 'Numéro WhatsApp (avec indicatif, ex: +22997000000)', type: 'text' },
  { key: 'whatsapp_message_generic', label: 'Message WhatsApp générique', type: 'textarea' },
  { key: 'email', label: 'Email de contact', type: 'email' },
  { key: 'address', label: 'Adresse physique', type: 'text' },
  { key: 'city', label: 'Ville', type: 'text' },
  { key: 'maps_link', label: 'Lien Google Maps (ouvrir)', type: 'text' },
  { key: 'maps_embed_url', label: 'URL d\'intégration Google Maps (iframe)', type: 'text' },
  { key: 'currency_symbol', label: 'Symbole monétaire (ex: FCFA)', type: 'text' },
  { key: 'hero_title', label: 'Titre de la bannière principale', type: 'text' },
  { key: 'hero_subtitle', label: 'Sous-titre de la bannière', type: 'text' },
  { key: 'social_facebook', label: 'URL Facebook', type: 'text' },
  { key: 'social_instagram', label: 'URL Instagram', type: 'text' },
];

export default function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState(initialSettings);
  const [hours, setHours] = useState<Record<string, string>>(() => {
    if (initialSettings.hours) {
      try {
        return JSON.parse(initialSettings.hours);
      } catch {
        // ignore invalid old format
      }
    }

    return {
      'Lun – Sam': initialSettings.hours_semaine ?? initialSettings['Lun – Sam'] ?? '',
      'Dimanche': initialSettings.hours_dimanche ?? initialSettings['Dimanche'] ?? '',
    };
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function set(key: string, value: string) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  function setHour(day: string, value: string) {
    setHours((h) => ({ ...h, [day]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const payload: Record<string, string | null> = {};
    for (const key of Object.keys(settings)) {
      if (key !== 'hours') payload[key] = settings[key] ?? '';
    }
    payload.hours_semaine = hours['Lun – Sam'] ?? null;
    payload.hours_dimanche = hours['Dimanche'] ?? null;

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-brand">{error}</div>}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-brand flex items-center gap-2">
          <Check size={16} /> Paramètres enregistrés avec succès.
        </div>
      )}

      {/* Informations générales */}
      <section className="bg-white rounded-brand border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-sm uppercase tracking-wider text-gray-400">Informations de la boutique</h2>
        {FIELDS.map(({ key, label, type }) => (
          <div key={key}>
            <label className="label-admin">{label}</label>
            {type === 'textarea' ? (
              <textarea
                value={settings[key] ?? ''}
                onChange={(e) => set(key, e.target.value)}
                rows={3}
                className="input-admin resize-none"
              />
            ) : (
              <input
                type={type}
                value={settings[key] ?? ''}
                onChange={(e) => set(key, e.target.value)}
                className="input-admin"
              />
            )}
          </div>
        ))}
      </section>

      {/* Horaires */}
      <section className="bg-white rounded-brand border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-sm uppercase tracking-wider text-gray-400">Horaires d&apos;ouverture</h2>
        <p className="text-xs text-gray-400">
          Exemple : «&nbsp;08h00 – 19h00&nbsp;» ou «&nbsp;Fermé&nbsp;»
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm font-semibold text-brand-dark shrink-0">Lun – Sam</span>
            <input
              type="text"
              value={hours['Lun – Sam'] ?? ''}
              onChange={(e) => setHour('Lun – Sam', e.target.value)}
              className="input-admin flex-1"
              placeholder="08h00 – 21h00"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-sm font-semibold text-brand-dark shrink-0">Dimanche</span>
            <input
              type="text"
              value={hours['Dimanche'] ?? ''}
              onChange={(e) => setHour('Dimanche', e.target.value)}
              className="input-admin flex-1"
              placeholder="Fermé"
            />
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="px-6 h-10 bg-brand-blue text-white font-bold text-sm rounded-brand hover:bg-brand-blue-light transition-colors disabled:opacity-60 flex items-center gap-2"
      >
        {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        Enregistrer les paramètres
      </button>
    </form>
  );
}
