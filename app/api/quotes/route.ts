// app/api/quotes/route.ts — Soumission publique d'une demande de devis
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, product_id, product_name } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Nom et email requis' }, { status: 400 });
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('quotes')
      .insert([{ name, email, phone, message, product_id, product_name, status: 'pending' }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ data, message: 'Demande envoyée' }, { status: 201 });
  } catch (err) {
    console.error('[API/quotes POST]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
