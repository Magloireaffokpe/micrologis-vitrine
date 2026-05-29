import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl mb-4">🔍</p>
      <h1 className="font-head text-3xl font-black text-brand-dark mb-2">Page introuvable</h1>
      <p className="text-gray-500 mb-8">Cette page n&apos;existe pas ou a été déplacée.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-brand-blue text-white font-semibold px-6 h-11 rounded-brand-sm hover:opacity-90 transition-opacity"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
