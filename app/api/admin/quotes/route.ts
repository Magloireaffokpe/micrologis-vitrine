// app/api/admin/quotes/route.ts
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const pageSize = parseInt(searchParams.get('pageSize') ?? '20');
  const status = searchParams.get('status');
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = createAdminSupabaseClient();
  let query = supabase
    .from('quotes')
    .select('*, product:products(id,name,slug)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) query = query.eq('status', status);

  const { data, error: dbError, count } = await query;
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({
    data: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  });
}
