// app/api/products/route.ts — Lecture publique des produits (GET)
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getEffectivePrice } from '@/lib/utils';
import type { Product } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const pageSize = Math.min(48, parseInt(searchParams.get('pageSize') ?? '12'));
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const condition = searchParams.get('condition');
    const inStock = searchParams.get('inStock');
    const featured = searchParams.get('featured');
    const promo = searchParams.get('promo');

    const supabase = await createServerSupabaseClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('products')
      .select('*, category:categories(id,name,slug)', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (category) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();
      if (cat) query = query.eq('category_id', cat.id);
    }
    if (condition && ['new', 'occasion', 'reconditioned'].includes(condition)) {
      query = query.eq('condition', condition);
    }
    if (inStock === 'true') query = query.eq('in_stock', true);
    if (featured === 'true') query = query.eq('is_featured', true);
    if (promo === 'true') query = query.eq('is_promo', true);
    if (minPrice) query = query.gte('price', parseInt(minPrice));
    if (maxPrice) query = query.lte('price', parseInt(maxPrice));
    if (search) query = query.ilike('name', `%${search}%`);

    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    const products = (data ?? []).map((p) => ({
      ...p,
      featured: p.is_featured ?? false,
      effective_price: getEffectivePrice(p as Product),
    }));

    return NextResponse.json({
      data: products,
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    });
  } catch (err) {
    console.error('[API/products GET]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
