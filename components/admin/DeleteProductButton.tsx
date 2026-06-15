'use client';
// components/admin/DeleteProductButton.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface Props { id: string; name: string }

export default function DeleteProductButton({ id, name }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer « ${name} » ? Cette action est irréversible.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) {
        router.refresh();
      } else {
        const { error } = await res.json();
        alert(error ?? 'Erreur lors de la suppression');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
      title="Supprimer"
    >
      <Trash2 size={15} />
    </button>
  );
}
