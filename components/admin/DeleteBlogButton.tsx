'use client';
// components/admin/DeleteBlogButton.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteBlogButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer « ${title} » ?`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (res.ok) router.refresh();
    else alert('Erreur lors de la suppression');
    setLoading(false);
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
      title="Supprimer">
      <Trash2 size={15} />
    </button>
  );
}
