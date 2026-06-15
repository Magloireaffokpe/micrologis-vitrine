// app/api/admin/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = createAdminSupabaseClient();
  const { data, error: dbError } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const body: Record<string, unknown> = await request.json();
    if (!body.slug && body.title) body.slug = slugify(String(body.title));
    if (body.is_published && !body.published_at) {
      body.published_at = new Date().toISOString();
    }

    const supabase = createAdminSupabaseClient();
    const { data, error: dbError } = await supabase
      .from('blog_posts')
      .insert([body as never])
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('[API/admin/blog POST]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
