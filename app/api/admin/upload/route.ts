// app/api/admin/upload/route.ts — Upload d'images vers Supabase Storage
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

const BUCKET = 'micrologis';
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Validation type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez JPG, PNG, WebP ou GIF.' },
        { status: 400 }
      );
    }

    // Validation taille
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Fichier trop lourd (max ${MAX_SIZE_MB} Mo)` },
        { status: 400 }
      );
    }

    // Sanitiser le dossier et n'autoriser que des chemins connus.
    const allowedFolders = ['products', 'blog', 'categories', 'settings', 'avatars'];
    const rawFolder = String(formData.get('folder') ?? 'products')
      .trim()
      .replace(/[^a-z0-9-_]/gi, '')
      .toLowerCase();
    const safeFolder = allowedFolders.includes(rawFolder) ? rawFolder : 'products';

    // Générer un nom de fichier unique en se basant sur le type MIME
    const extensionMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };
    const ext = extensionMap[file.type] ?? 'jpg';
    const fileName = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Convertir en ArrayBuffer pour Supabase
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const supabase = createAdminSupabaseClient();
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw new Error(uploadError.message);

    // Construire l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl, path: data.path }, { status: 201 });
  } catch (error) {
    console.error('[API/admin/upload POST]', error);
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
  }
}

// DELETE — supprimer un fichier du Storage
export async function DELETE(request: NextRequest) {
  const { error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const { path } = await request.json();
    if (!path) return NextResponse.json({ error: 'Chemin manquant' }, { status: 400 });

    const supabase = createAdminSupabaseClient();
    const { error: deleteError } = await supabase.storage.from(BUCKET).remove([path]);

    if (deleteError) throw new Error(deleteError.message);
    return NextResponse.json({ message: 'Fichier supprimé' });
  } catch (error) {
    console.error('[API/admin/upload DELETE]', error);
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 });
  }
}
