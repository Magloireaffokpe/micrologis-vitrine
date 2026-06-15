// app/api/admin/reviews/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

interface Params { params: { id: string } }

export async function PUT(request: NextRequest, { params }: Params) {
  const { error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const { is_approved } = await request.json();
    const supabase = createAdminSupabaseClient();

    const { data, error: dbError } = await supabase
      .from('reviews')
      .update({ is_approved } as never)
      .eq('id', params.id)
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('[API/admin/reviews/[id] PUT]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error: authError } = await requireAuth();
  if (authError) return authError;

  const supabase = createAdminSupabaseClient();
  const { error: dbError } = await supabase.from('reviews').delete().eq('id', params.id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ message: 'Avis supprimé' });
}
