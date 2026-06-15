// app/admin/page.tsx — Tableau de bord admin
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { Package, Tag, MessageSquare, Star, FileText, Mail } from 'lucide-react';

export const metadata = { title: 'Tableau de bord' };

async function getStats() {
  const supabase = createAdminSupabaseClient();
  const results = await Promise.allSettled([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('quotes').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', false),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
  ]);

  const extractCount = (result: PromiseSettledResult<{ count: number | null }>) =>
    result.status === 'fulfilled' ? (result.value.count ?? 0) : 0;

  return {
    products: extractCount(results[0]),
    categories: extractCount(results[1]),
    pendingQuotes: extractCount(results[2]),
    pendingReviews: extractCount(results[3]),
    blogPosts: extractCount(results[4]),
    unreadContacts: extractCount(results[5]),
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'Produits', value: stats.products, icon: Package, href: '/admin/products', color: 'bg-blue-50 text-blue-600' },
    { label: 'Catégories', value: stats.categories, icon: Tag, href: '/admin/categories', color: 'bg-purple-50 text-purple-600' },
    { label: 'Devis en attente', value: stats.pendingQuotes, icon: MessageSquare, href: '/admin/quotes', color: stats.pendingQuotes > 0 ? 'bg-orange-50 text-brand-orange' : 'bg-gray-50 text-gray-400' },
    { label: 'Avis à modérer', value: stats.pendingReviews, icon: Star, href: '/admin/reviews', color: stats.pendingReviews > 0 ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-400' },
    { label: 'Articles blog', value: stats.blogPosts, icon: FileText, href: '/admin/blog', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Messages non lus', value: stats.unreadContacts, icon: Mail, href: '/admin/settings', color: stats.unreadContacts > 0 ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-dark">Tableau de bord</h1>
        <p className="text-sm text-gray-400 mt-1">Bienvenue dans l&apos;interface d&apos;administration MICROLOGIS.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <a
            key={label}
            href={href}
            className="bg-white rounded-brand border border-gray-100 p-5 hover:shadow-brand-hover transition-shadow flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-brand flex items-center justify-center ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-brand-dark leading-none">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 bg-brand-blue-pale border border-brand-blue/20 rounded-brand p-4 text-sm text-brand-blue">
        <strong>Rappel sécurité :</strong> Ne partagez jamais vos identifiants admin. Déconnectez-vous après chaque session.
      </div>
    </div>
  );
}
