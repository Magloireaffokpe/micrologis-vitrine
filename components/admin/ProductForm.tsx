'use client';
// components/admin/ProductForm.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';
import ImageUpload from './ImageUpload';
import type { Product, Category } from '@/types';

interface ProductFormProps {
  product?: Partial<Product>;   // undefined = création
  categories: Category[];
}

const CONDITION_OPTIONS = [
  { value: 'new', label: 'Neuf' },
  { value: 'occasion', label: 'Occasion' },
  { value: 'reconditioned', label: 'Reconditionné' },
];

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product?.id;

  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    specs: product?.specs ?? '',
    price: product?.price?.toString() ?? '',
    price_original: product?.price_original?.toString() ?? '',
    category_id: product?.category_id ?? '',
    subcategory: product?.subcategory ?? '',
    condition: product?.condition ?? 'new',
    in_stock: product?.in_stock ?? true,
    stock_qty: product?.stock_qty?.toString() ?? '',
    images: product?.images ?? [],
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? product?.featured ?? false,
    is_promo: product?.is_promo ?? false,
    price_promo: product?.price_promo?.toString() ?? '',
    promo_start: product?.promo_start?.slice(0, 10) ?? '',
    promo_end: product?.promo_end?.slice(0, 10) ?? '',
    tags: product?.tags?.join(', ') ?? '',
    whatsapp_message: product?.whatsapp_message ?? '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleNameChange(name: string) {
    set('name', name);
    if (!isEdit) set('slug', slugify(name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      specs: form.specs,
      price: form.price ? parseFloat(form.price) : null,
      price_original: form.price_original ? parseFloat(form.price_original) : null,
      category_id: form.category_id || null,
      subcategory: form.subcategory,
      condition: form.condition,
      in_stock: form.in_stock,
      stock_qty: form.stock_qty ? parseInt(form.stock_qty) : null,
      images: form.images,
      is_active: form.is_active,
      is_featured: form.is_featured,
      is_promo: form.is_promo,
      price_promo: form.price_promo ? parseFloat(form.price_promo) : null,
      promo_start: form.promo_start || null,
      promo_end: form.promo_end || null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      whatsapp_message: form.whatsapp_message || null,
    };

    try {
      const url = isEdit ? `/api/admin/products/${product!.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur');

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-brand">
          {error}
        </div>
      )}

      {/* Informations de base */}
      <section className="bg-white rounded-brand border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-sm uppercase tracking-wider text-gray-400">Informations générales</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-admin">Nom du produit *</label>
            <input
              type="text" required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="input-admin"
              placeholder="Ex : HP EliteBook 840 G8"
            />
          </div>
          <div>
            <label className="label-admin">Slug (URL)</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              className="input-admin font-mono text-xs"
              placeholder="hp-elitebook-840-g8"
            />
          </div>
        </div>

        <div>
          <label className="label-admin">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            className="input-admin resize-none"
            placeholder="Description complète du produit…"
          />
        </div>

        <div>
          <label className="label-admin">Spécifications courtes</label>
          <input
            type="text"
            value={form.specs}
            onChange={(e) => set('specs', e.target.value)}
            className="input-admin"
            placeholder="i5 · 8 Go RAM · 256 Go SSD · 14 pouces"
          />
          <p className="text-xs text-gray-400 mt-1">Séparées par des points (·) — affichées en sous-titre</p>
        </div>

        <div>
          <label className="label-admin">Message WhatsApp personnalisé</label>
          <textarea
            value={form.whatsapp_message}
            onChange={(e) => set('whatsapp_message', e.target.value)}
            rows={2}
            className="input-admin resize-none"
            placeholder="Bonjour MICROLOGIS, je suis intéressé par…"
          />
          <p className="text-xs text-gray-400 mt-1">Laisser vide pour utiliser le message générique</p>
        </div>
      </section>

      {/* Catégorie & Classification */}
      <section className="bg-white rounded-brand border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-sm uppercase tracking-wider text-gray-400">Catégorie & Classification</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label-admin">Catégorie</label>
            <select
              value={form.category_id}
              onChange={(e) => set('category_id', e.target.value)}
              className="input-admin"
            >
              <option value="">— Sélectionner —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-admin">Sous-catégorie / Marque</label>
            <input
              type="text"
              value={form.subcategory}
              onChange={(e) => set('subcategory', e.target.value)}
              className="input-admin"
              placeholder="HP, Samsung, Apple…"
            />
          </div>
          <div>
            <label className="label-admin">État</label>
            <select
              value={form.condition}
              onChange={(e) => set('condition', e.target.value)}
              className="input-admin"
            >
              {CONDITION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label-admin">Tags (séparés par des virgules)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
            className="input-admin"
            placeholder="HP, ordinateur, i5, bureau"
          />
        </div>
      </section>

      {/* Prix */}
      <section className="bg-white rounded-brand border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-sm uppercase tracking-wider text-gray-400">Prix</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-admin">Prix de vente (FCFA) *</label>
            <input
              type="number" min="0" step="500"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              className="input-admin"
              placeholder="150000"
            />
          </div>
          <div>
            <label className="label-admin">Prix barré / original (FCFA)</label>
            <input
              type="number" min="0" step="500"
              value={form.price_original}
              onChange={(e) => set('price_original', e.target.value)}
              className="input-admin"
              placeholder="180000"
            />
          </div>
        </div>

        {/* Promotion */}
        <div className="border border-dashed border-gray-200 rounded-brand p-4 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_promo}
              onChange={(e) => set('is_promo', e.target.checked)}
              className="w-4 h-4 accent-brand-orange"
            />
            <span className="font-semibold text-sm text-brand-dark">Activer une promotion</span>
          </label>

          {form.is_promo && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label-admin">Prix promo (FCFA)</label>
                <input
                  type="number" min="0" step="500"
                  value={form.price_promo}
                  onChange={(e) => set('price_promo', e.target.value)}
                  className="input-admin"
                />
              </div>
              <div>
                <label className="label-admin">Date début</label>
                <input
                  type="date"
                  value={form.promo_start}
                  onChange={(e) => set('promo_start', e.target.value)}
                  className="input-admin"
                />
              </div>
              <div>
                <label className="label-admin">Date fin</label>
                <input
                  type="date"
                  value={form.promo_end}
                  onChange={(e) => set('promo_end', e.target.value)}
                  className="input-admin"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stock */}
      <section className="bg-white rounded-brand border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-sm uppercase tracking-wider text-gray-400">Stock & Visibilité</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="label-admin">Quantité en stock</label>
            <input
              type="number" min="0"
              value={form.stock_qty}
              onChange={(e) => set('stock_qty', e.target.value)}
              className="input-admin"
              placeholder="Laisser vide si non géré"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          {[
            { key: 'in_stock', label: 'En stock' },
            { key: 'is_active', label: 'Publié (visible)' },
            { key: 'is_featured', label: 'Mis en avant (accueil)' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form[key as keyof typeof form] as boolean}
                onChange={(e) => set(key, e.target.checked)}
                className="w-4 h-4 accent-brand-blue"
              />
              <span className="text-sm font-medium text-brand-dark">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-brand border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-sm uppercase tracking-wider text-gray-400">Images</h2>
        <ImageUpload
          value={form.images}
          onChange={(urls) => set('images', urls)}
          folder="products"
          multiple
          maxFiles={5}
        />
      </section>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 h-10 bg-brand-blue text-white font-bold text-sm rounded-brand hover:bg-brand-blue-light transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {isEdit ? 'Enregistrer' : 'Créer le produit'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 h-10 bg-gray-100 text-brand-dark font-bold text-sm rounded-brand hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
