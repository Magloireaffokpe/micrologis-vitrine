// app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = createAdminSupabaseClient();
  const { data, error: dbError } = await supabase.from('settings').select('*');
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  // Retourner un objet plat key→value
  const settings: Record<string, string> = {};
  (data ?? []).forEach((s: { key: string; value: string | null }) => {
    settings[s.key] = s.value ?? '';
  });

  return NextResponse.json({ data: settings });
}

export async function PUT(request: NextRequest) {
  const { error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const body: Record<string, string> = await request.json();
    const supabase = createAdminSupabaseClient();

    // Upsert chaque clé
    const upserts = Object.entries(body).map(([key, value]) => ({ key, value }));

    const { error: dbError } = await supabase
      .from('settings')
      .upsert(upserts as never, { onConflict: 'key' });

    if (dbError) throw new Error(dbError.message);
    return NextResponse.json({ message: 'Paramètres mis à jour' });
  } catch (err) {
    console.error('[API/admin/settings PUT]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
