// lib/auth.ts — Vérification d'auth dans les API routes
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface AuthResult {
  userId: string | null;
  error: NextResponse | null;
}

/**
 * Vérifie que l'utilisateur est authentifié.
 * À appeler en tête de chaque API route protégée.
 *
 * Usage :
 *   const { userId, error } = await requireAuth();
 *   if (error) return error;
 */
export async function requireAuth(): Promise<AuthResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.warn('[requireAuth] Non authentifié:', {
        message: error?.message ?? 'pas de session',
        code: error?.code ?? null,
        status: error?.status ?? null,
      });
      return {
        userId: null,
        error: NextResponse.json(
          { error: 'Non autorisé — connexion requise', detail: error?.message ?? null },
          { status: 401 }
        ),
      };
    }

    return { userId: user.id, error: null };
  } catch (err) {
    console.error('[requireAuth] Exception:', err instanceof Error ? err.message : err);
    return {
      userId: null,
      error: NextResponse.json({ error: 'Erreur d\'authentification' }, { status: 500 }),
    };
  }
}
