// app/blog/page.tsx — Liste des articles
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDate, truncate } from '@/lib/utils';
import type { BlogPost } from '@/types';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Blog & Actualités' };

export default async function BlogPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  const posts = (data ?? []) as BlogPost[];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-brand-dark mb-2">Blog & Actualités</h1>
      <p className="text-gray-400 mb-8">Conseils tech, nouveautés et offres de MICROLOGIS.</p>

      {posts.length === 0 && (
        <p className="text-gray-400 text-center py-16">Aucun article publié pour le moment.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}
            className="group bg-white rounded-brand border border-gray-100 overflow-hidden hover:shadow-brand-hover transition-shadow">
            {post.cover_image && (
              <div className="aspect-video relative overflow-hidden">
                <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            )}
            <div className="p-5">
              <p className="text-xs text-gray-400 mb-2">{post.published_at ? formatDate(post.published_at) : ''}</p>
              <h2 className="font-black text-brand-dark text-base mb-1 group-hover:text-brand-blue transition-colors leading-tight">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-sm text-gray-500">{truncate(post.excerpt, 100)}</p>
              )}
              <p className="text-xs font-bold text-brand-blue mt-3">Lire →</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
