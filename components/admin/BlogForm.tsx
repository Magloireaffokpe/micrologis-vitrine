'use client';
// components/admin/BlogForm.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';
import ImageUpload from './ImageUpload';
import type { BlogPost } from '@/types';

interface Props { post?: Partial<BlogPost> }

export default function BlogForm({ post }: Props) {
  const router = useRouter();
  const isEdit = !!post?.id;

  const [form, setForm] = useState({
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    cover_image: post?.cover_image ? [post.cover_image] : [] as string[],
    is_published: post?.is_published ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      cover_image: form.cover_image[0] ?? null,
    };

    try {
      const url = isEdit ? `/api/admin/blog/${post!.id}` : '/api/admin/blog';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur');
      router.push('/admin/blog');
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

      <section className="bg-white rounded-brand border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-admin">Titre *</label>
            <input type="text" required value={form.title}
              onChange={(e) => { set('title', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)); }}
              className="input-admin" placeholder="Mon article" />
          </div>
          <div>
            <label className="label-admin">Slug</label>
            <input type="text" value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              className="input-admin font-mono text-xs" />
          </div>
        </div>

        <div>
          <label className="label-admin">Extrait (affiché dans la liste)</label>
          <textarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)}
            rows={2} className="input-admin resize-none"
            placeholder="Courte description de l'article…" />
        </div>

        <div>
          <label className="label-admin">Contenu (HTML ou Markdown)</label>
          <textarea value={form.content} onChange={(e) => set('content', e.target.value)}
            rows={16} className="input-admin resize-y font-mono text-xs leading-relaxed"
            placeholder="<p>Contenu de l'article…</p>"
            style={{ minHeight: '360px', maxWidth: '100%' }} />
        </div>

        <div>
          <label className="label-admin">Image de couverture</label>
          <ImageUpload
            value={form.cover_image}
            onChange={(urls) => set('cover_image', urls)}
            folder="blog"
            multiple={false}
            maxFiles={1}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_published}
            onChange={(e) => set('is_published', e.target.checked)}
            className="w-4 h-4 accent-brand-blue" />
          <span className="text-sm font-medium text-brand-dark">Publier immédiatement</span>
        </label>
      </section>

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="px-6 h-10 bg-brand-blue text-white font-bold text-sm rounded-brand hover:bg-brand-blue-light transition-colors disabled:opacity-60 flex items-center gap-2">
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {isEdit ? 'Enregistrer' : 'Créer l\'article'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 h-10 bg-gray-100 text-brand-dark font-bold text-sm rounded-brand hover:bg-gray-200 transition-colors">
          Annuler
        </button>
      </div>
    </form>
  );
}
