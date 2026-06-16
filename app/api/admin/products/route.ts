// app/api/admin/products/route.ts — CRUD produits (admin)
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';

// GET — liste tous les produits (admin voit aussi les inactifs)
export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const supabase = createAdminSupabaseClient();
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const pageSize = parseInt(searchParams.get('pageSize') ?? '20');
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error: dbError, count } = await supabase
      .from('products')
      .select('*, category:categories(id,name,slug)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({
      data: data ?? [],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    });
  } catch (err) {
    console.error('[API/admin/products GET]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST — créer un produit
export async function POST(request: NextRequest) {
  const { error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const body: Record<string, unknown> = await request.json();
    const supabase = createAdminSupabaseClient();

    // Générer un slug si absent
    if (!body.slug && body.name) {
      body.slug = slugify(String(body.name));
    }

    // Vérifier l'unicité du slug
    const slug = String(body.slug ?? '');
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      body.slug = `${slug}-${Date.now()}`;
    }

    const { data, error: dbError } = await supabase
      .from('products')
      .insert([body as never])
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('[API/admin/products POST]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
