/**
 * Composant générique pour injecter des données JSON-LD (Schema.org) dans le <head>.
 * À utiliser dans les Server Components uniquement.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
