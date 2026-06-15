// app/api/admin/blog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

interface Params { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = createAdminSupabaseClient();
  const { data, error: dbError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (dbError || !data) return NextResponse.json({ error: 'Article introuvable' }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const body: Record<string, unknown> = await request.json();
    if (body.is_published && !body.published_at) {
      body.published_at = new Date().toISOString();
    }
    const supabase = createAdminSupabaseClient();
    const { data, error: dbError } = await supabase
      .from('blog_posts')
      .update(body as never)
      .eq('id', params.id)
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('[API/admin/blog/[id] PUT]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error: authError } = await requireAuth();
  if (authError) return authError;

  const supabase = createAdminSupabaseClient();
  const { error: dbError } = await supabase.from('blog_posts').delete().eq('id', params.id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ message: 'Article supprimé' });
}
