"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3x3, Phone, Search, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onSearchOpen?: () => void;
}

export default function BottomNav({ onSearchOpen }: BottomNavProps) {
  const pathname = usePathname();

  function handleSearch(e: React.MouseEvent) {
    e.preventDefault();
    onSearchOpen?.();
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-[1.5px] border-gray-100 h-[58px] flex">
      <Link
        href="/"
        className={cn(
          "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
          pathname === "/" ? "text-brand-blue" : "text-gray-400 hover:text-brand-dark"
        )}
      >
        <Home size={22} />
        Accueil
      </Link>
      <Link
        href="/#categories"
        className={cn(
          "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
          pathname === "/" ? "text-brand-blue" : "text-gray-400 hover:text-brand-dark"
        )}
      >
        <Grid3x3 size={22} />
        Catégories
      </Link>
      <button
        onClick={handleSearch}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-gray-400 hover:text-brand-dark transition-colors"
      >
        <Search size={22} />
        Chercher
      </button>
      <Link
        href="/blog"
        className={cn(
          "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
          pathname.startsWith("/blog") ? "text-brand-blue" : "text-gray-400 hover:text-brand-dark"
        )}
      >
        <Newspaper size={22} />
        Actualités
      </Link>
      <Link
        href="/contact"
        className={cn(
          "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
          pathname.startsWith("/contact") ? "text-brand-blue" : "text-gray-400 hover:text-brand-dark"
        )}
      >
        <Phone size={22} />
        Contact
      </Link>
    </nav>
  );
}
