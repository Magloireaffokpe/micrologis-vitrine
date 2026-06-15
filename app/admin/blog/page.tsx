// app/admin/blog/page.tsx
import Link from 'next/link';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react';
import type { BlogPost } from '@/types';
import DeleteBlogButton from '@/components/admin/DeleteBlogButton';

export const metadata = { title: 'Blog' };
export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[AdminBlogPage] Erreur Supabase:', error.message);
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-semibold mb-2">Erreur lors du chargement des articles</p>
        <p className="text-sm text-gray-400">{error.message}</p>
      </div>
    );
  }

  const posts = (data ?? []) as BlogPost[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-400">{posts.length} article(s)</p>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 h-9 px-4 bg-brand-blue text-white text-sm font-bold rounded-brand hover:bg-brand-blue-light transition-colors"
        >
          <Plus size={16} /> Nouvel article
        </Link>
      </div>

      <div className="overflow-x-auto rounded-brand border border-gray-100 bg-white shadow-sm">
        <table className="min-w-[640px] w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Titre</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Statut</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Publié le</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400">
                  Aucun article. <Link href="/admin/blog/new" className="text-brand-blue font-semibold">Créer le premier →</Link>
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-brand-dark">{post.title}</p>
                  <p className="text-xs text-gray-400 font-mono">{post.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold ${post.is_published ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {post.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                    {post.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {post.published_at ? formatDate(post.published_at) : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/blog/${post.id}`} className="p-1.5 text-gray-400 hover:text-brand-blue transition-colors">
                      <Pencil size={15} />
                    </Link>
                    <DeleteBlogButton id={post.id} title={post.title} />
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
