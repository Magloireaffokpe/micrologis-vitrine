// app/admin/blog/[id]/page.tsx
import { notFound } from 'next/navigation';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import BlogForm from '@/components/admin/BlogForm';
import type { BlogPost } from '@/types';

export const metadata = { title: 'Modifier l\'article' };
export const dynamic = 'force-dynamic';

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase.from('blog_posts').select('*').eq('id', params.id).single();
  if (!data) notFound();
  return (
    <div>
      <h1 className="text-xl font-black text-brand-dark mb-6">Modifier l&apos;article</h1>
      <BlogForm post={data as BlogPost} />
    </div>
  );
}
