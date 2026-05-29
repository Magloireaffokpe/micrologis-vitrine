"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3x3, Phone, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "Catégories", href: "/#categories", icon: Grid3x3 },
  { label: "Chercher", href: "#search", icon: Search },
  { label: "Contact", href: "/contact", icon: Phone },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-[1.5px] border-gray-100 h-[58px] flex">
      {items.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
              active ? "text-brand-blue" : "text-gray-400 hover:text-brand-dark"
            )}
          >
            <Icon size={22} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
