// app/api/admin/reviews/route.ts
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const searchParams = request.nextUrl.searchParams;
  const approved = searchParams.get('approved');
  const supabase = createAdminSupabaseClient();

  let query = supabase
    .from('reviews')
    .select('*, product:products(id,name,slug)')
    .order('created_at', { ascending: false });

  if (approved !== null) query = query.eq('is_approved', approved === 'true');

  const { data, error: dbError } = await query;
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}
