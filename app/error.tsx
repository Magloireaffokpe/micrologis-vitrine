'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl mb-4">⚠️</p>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Une erreur est survenue</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        {error?.message || 'Quelque chose s\'est mal passé. Veuillez réessayer.'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 h-11 rounded-md hover:opacity-90 transition-opacity"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 font-semibold px-6 h-11 rounded-md hover:bg-gray-200 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
