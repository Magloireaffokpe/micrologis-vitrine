import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center gap-1 text-sm text-gray-500 py-3">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} className="text-gray-300" />}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-brand-blue transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-brand-dark font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
