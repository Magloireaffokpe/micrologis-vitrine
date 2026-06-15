// app/admin/settings/page.tsx
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import SettingsForm from '@/components/admin/SettingsForm';

export const metadata = { title: 'Paramètres' };
export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.from('settings').select('key, value');

  if (error) {
    console.error('[AdminSettingsPage] Erreur Supabase:', error.message);
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-semibold mb-2">Erreur lors du chargement des paramètres</p>
        <p className="text-sm text-gray-400">{error.message}</p>
      </div>
    );
  }

  const settings: Record<string, string> = {};
  (data ?? []).forEach((s: { key: string; value: string | null }) => {
    settings[s.key] = s.value ?? '';
  });

  return (
    <div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
