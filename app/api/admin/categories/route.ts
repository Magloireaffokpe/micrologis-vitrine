// app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = createAdminSupabaseClient();
  const { data, error: dbError } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const body: Record<string, unknown> = await request.json();
    if (!body.slug && body.name) body.slug = slugify(String(body.name));

    const supabase = createAdminSupabaseClient();
    const { data, error: dbError } = await supabase
      .from('categories')
      .insert([body as never])
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('[API/admin/categories POST]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
