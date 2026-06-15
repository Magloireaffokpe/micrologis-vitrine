// app/blog/[slug]/page.tsx — Détail d'un article
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types';

export const revalidate = 60;

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('title, excerpt, cover_image')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();
  if (!data) return { title: 'Article introuvable' };
  return {
    title: data.title,
    description: data.excerpt ?? '',
    openGraph: { images: data.cover_image ? [{ url: data.cover_image }] : [] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!data) notFound();
  const post = data as BlogPost;

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/blog" className="text-sm text-brand-blue font-semibold hover:underline mb-6 inline-block">
        ← Retour au blog
      </Link>

      {post.cover_image && (
        <div className="aspect-video relative rounded-brand overflow-hidden mb-6">
          <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <p className="text-xs text-gray-400 mb-2">
        {post.published_at ? formatDate(post.published_at) : ''}
      </p>
      <h1 className="text-3xl font-black text-brand-dark mb-6 leading-tight">{post.title}</h1>

      {post.content && (
        <div
          className="prose prose-sm max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
    </main>
  );
}
