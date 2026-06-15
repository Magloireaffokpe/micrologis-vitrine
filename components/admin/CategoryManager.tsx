'use client';
// components/admin/CategoryManager.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';
import { Plus, Pencil, Trash2, GripVertical, Check, X } from 'lucide-react';
import type { Category } from '@/types';
import ImageUpload from './ImageUpload';

interface Props { initialCategories: Category[] }

const EMPTY: Partial<Category> = {
  name: '', slug: '', description: '', image_url: null,
  icon: 'Package', color: '#1B5EC2', bg_color: '#EBF2FF',
  sort_order: 0, is_active: true,
};

export default function CategoryManager({ initialCategories }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [editing, setEditing] = useState<string | null>(null); // id ou 'new'
  const [form, setForm] = useState<Partial<Category>>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function startNew() {
    setForm({ ...EMPTY, sort_order: categories.length });
    setEditing('new');
    setError('');
  }

  function startEdit(cat: Category) {
    setForm({ ...cat });
    setEditing(cat.id);
    setError('');
  }

  function cancel() {
    setEditing(null);
    setForm(EMPTY);
    setError('');
  }

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!form.name) { setError('Le nom est requis.'); return; }
    setLoading(true);
    setError('');

    const payload = {
      ...form,
      slug: form.slug || slugify(form.name!),
      image_url: (form as { image_url?: string[] | string | null }).image_url instanceof Array
        ? ((form as { image_url?: string[] | string | null }).image_url as string[])[0] ?? null
        : form.image_url,
    };

    try {
      const isNew = editing === 'new';
      const url = isNew ? '/api/admin/categories' : `/api/admin/categories/${editing}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur');

      router.refresh();
      // Mise à jour locale optimiste
      if (isNew) {
        setCategories((prev) => [...prev, data.data]);
      } else {
        setCategories((prev) =>
          prev.map((c) => (c.id === editing ? data.data : c))
        );
      }
      cancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer la catégorie « ${name} » ? Les produits associés ne seront pas supprimés.`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } else {
      const { error } = await res.json();
      alert(error ?? 'Erreur');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-400">{categories.length} catégorie(s)</p>
        <button
          onClick={startNew}
          className="flex items-center gap-2 h-9 px-4 bg-brand-blue text-white text-sm font-bold rounded-brand hover:bg-brand-blue-light transition-colors"
        >
          <Plus size={16} /> Nouvelle catégorie
        </button>
      </div>

      {/* Formulaire création/édition */}
      {editing && (
        <div className="bg-white border border-brand-blue/30 rounded-brand p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-brand-dark mb-4">
            {editing === 'new' ? 'Nouvelle catégorie' : 'Modifier la catégorie'}
          </h2>

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="label-admin">Nom *</label>
              <input
                type="text"
                value={form.name ?? ''}
                onChange={(e) => {
                  set('name', e.target.value);
                  if (editing === 'new') set('slug', slugify(e.target.value));
                }}
                className="input-admin"
                placeholder="Ordinateurs portables"
              />
            </div>
            <div>
              <label className="label-admin">Slug</label>
              <input
                type="text"
                value={form.slug ?? ''}
                onChange={(e) => set('slug', e.target.value)}
                className="input-admin font-mono text-xs"
                placeholder="ordinateurs-portables"
              />
            </div>
            <div>
              <label className="label-admin">Nom court (menu)</label>
              <input
                type="text"
                value={form.name_short ?? ''}
                onChange={(e) => set('name_short', e.target.value)}
                className="input-admin"
                placeholder="Laptops"
              />
            </div>
            <div>
              <label className="label-admin">Icône Lucide</label>
              <input
                type="text"
                value={form.icon ?? ''}
                onChange={(e) => set('icon', e.target.value)}
                className="input-admin"
                placeholder="Laptop, Smartphone, Printer…"
              />
              <p className="text-xs text-gray-400 mt-0.5">Nom exact depuis lucide.dev</p>
            </div>
            <div>
              <label className="label-admin">Couleur texte</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={form.color ?? '#1B5EC2'}
                  onChange={(e) => set('color', e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded border border-gray-200"
                />
                <input
                  type="text"
                  value={form.color ?? ''}
                  onChange={(e) => set('color', e.target.value)}
                  className="input-admin flex-1 font-mono text-xs"
                />
              </div>
            </div>
            <div>
              <label className="label-admin">Couleur fond badge</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={form.bg_color ?? '#EBF2FF'}
                  onChange={(e) => set('bg_color', e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded border border-gray-200"
                />
                <input
                  type="text"
                  value={form.bg_color ?? ''}
                  onChange={(e) => set('bg_color', e.target.value)}
                  className="input-admin flex-1 font-mono text-xs"
                />
              </div>
            </div>
            <div className="col-span-2 md:col-span-3">
              <label className="label-admin">Description</label>
              <input
                type="text"
                value={form.description ?? ''}
                onChange={(e) => set('description', e.target.value)}
                className="input-admin"
                placeholder="Courte description affichée sur la page catégorie"
              />
            </div>
            <div>
              <label className="label-admin">Ordre d&apos;affichage</label>
              <input
                type="number" min="0"
                value={form.sort_order ?? 0}
                onChange={(e) => set('sort_order', parseInt(e.target.value))}
                className="input-admin"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active ?? true}
                  onChange={(e) => set('is_active', e.target.checked)}
                  className="w-4 h-4 accent-brand-blue"
                />
                <span className="text-sm font-medium text-brand-dark">Active (visible)</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="label-admin">Image de la catégorie</label>
            <ImageUpload
              value={form.image_url ? [form.image_url as string] : []}
              onChange={(urls) => set('image_url', urls[0] ?? null)}
              folder="categories"
              multiple={false}
              maxFiles={1}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-1.5 h-9 px-4 bg-brand-blue text-white text-sm font-bold rounded-brand hover:bg-brand-blue-light transition-colors disabled:opacity-60"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Check size={15} />}
              Enregistrer
            </button>
            <button
              onClick={cancel}
              className="flex items-center gap-1.5 h-9 px-4 bg-gray-100 text-brand-dark text-sm font-bold rounded-brand hover:bg-gray-200 transition-colors"
            >
              <X size={15} /> Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="bg-white rounded-brand border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="w-8 px-3 py-3" />
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Catégorie</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Slug</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Ordre</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  Aucune catégorie.
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-3 py-3 text-gray-300">
                  <GripVertical size={16} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-brand flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: cat.bg_color, color: cat.color }}
                    >
                      {cat.name[0]}
                    </span>
                    <span className="font-semibold text-brand-dark">{cat.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{cat.slug}</td>
                <td className="px-4 py-3 text-gray-500">{cat.sort_order}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold ${cat.is_active ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-1.5 text-gray-400 hover:text-brand-blue transition-colors"
                      title="Modifier"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={15} />
                    </button>
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
