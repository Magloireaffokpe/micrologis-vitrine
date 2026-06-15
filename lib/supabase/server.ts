// lib/supabase/server.ts — client côté serveur (SSR cookies)
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

let _adminSupabaseClient: ReturnType<typeof createClient> | null = null;

export async function createServerSupabaseClient() {
  let cookieStore;
  try {
    cookieStore = await cookies();
  } catch {
    cookieStore = null;
  }

  interface CookieValue {
    name: string;
    value: string;
    options?: {
      [key: string]: unknown;
    };
  }

  const cookieOptions = {
    getAll: () => (cookieStore ? cookieStore.getAll() : []),
    setAll: (cookiesToSet: CookieValue[]) => {
      if (!cookieStore) return;
      try {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      } catch {
        // Appelé depuis un Server Component — ignoré
      }
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieOptions,
    }
  );
}

/**
 * Client admin (service_role) — contourne RLS.
 * À n'utiliser QUE dans les API routes côté serveur.
 * Ne jamais exposer SUPABASE_SERVICE_ROLE_KEY côté client.
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      '[Supabase Admin] Variables manquantes : vérifiez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env'
    );
  }

  if (key.startsWith('postgresql:') || key.startsWith('postgres:')) {
    throw new Error(
      '[Supabase Admin] La variable SUPABASE_SERVICE_ROLE_KEY contient une URL PostgreSQL au lieu de la clé API service_role. Récupérez la clé (commençant par "sb_secret_" ou "eyJ...") dans Project Settings > API de votre dashboard Supabase.'
    );
  }

  // Réutiliser un client admin singleton pour réduire l'overhead
  if (_adminSupabaseClient) return _adminSupabaseClient;

  _adminSupabaseClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _adminSupabaseClient;
}
