// app/api/reviews/route.ts — Soumission publique d'un avis
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, author_name, rating, comment } = body;

    if (!product_id || !author_name || !rating) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Note invalide (1-5)' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ product_id, author_name, rating, comment, is_approved: false }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ data, message: 'Avis soumis, en attente de modération' }, { status: 201 });
  } catch (err) {
    console.error('[API/reviews POST]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
