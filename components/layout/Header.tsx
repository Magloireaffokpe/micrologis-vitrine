import Link from "next/link";
import { Menu, ChevronDown, Phone } from "lucide-react";
import { StoreConfig, Category, Product } from "@/types";
import LogoSafe from "@/components/ui/LogoSafe";
import SearchBar from "@/components/ui/SearchBar";
import MegaMenu from "./MegaMenu";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { buildGenericLink } from "@/lib/whatsapp";

interface HeaderProps {
  config: StoreConfig;
  categories: Category[];
  products: Product[];
  onMenuOpen?: () => void;
  currentPath?: string;
}

export default function Header({ config, categories, products, onMenuOpen, currentPath }: HeaderProps) {
  const waLink = buildGenericLink(config);

  return (
    <header className="sticky top-0 z-40">
      {/* Top bar — contact info strip like Materiel.net */}
      <div className="bg-brand-dark-mid border-b border-white/5 hidden md:block">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-9">
          <p className="text-[11px] text-white/40">
            Votre partenaire high-tech à Parakou, Bénin
          </p>
          <div className="flex items-center gap-4">
            <a href={`tel:${config.phone}`} className="flex items-center gap-1.5 text-[11px] text-white/50 hover:text-white transition-colors">
              <Phone size={11} className="text-brand-orange" />
              {config.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main header bar */}
      <div className="bg-brand-dark border-b border-white/[0.08]">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center gap-4 lg:gap-6 h-[64px]">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative w-[120px] h-[44px]">
              <LogoSafe logoPath={config.logo_path} className="w-full h-full" />
            </div>
          </Link>

          {/* Search — takes all available space */}
          <SearchBar
            products={products}
            config={config}
            className="flex-1 hidden md:block"
          />

          {/* Desktop CTA */}
          <div className="flex items-center gap-3 ml-auto md:ml-0 shrink-0">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp text-white font-bold text-[13px] px-4 h-9 rounded-brand-sm hover:opacity-90 transition-opacity"
            >
              <WhatsAppIcon className="w-[15px] h-[15px]" />
              <span className="hidden lg:inline">WhatsApp</span>
            </a>
            {/* Mobile hamburger */}
            <button
              onClick={onMenuOpen}
              className="md:hidden flex items-center justify-center w-9 h-9 bg-white/10 text-white rounded-brand-sm hover:bg-white/20 transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Category nav bar */}
      <nav className="bg-[#161B22] border-b border-white/[0.06] hidden md:block overflow-x-auto">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center min-w-max">
          {categories.map((cat) => {
            const isActive = currentPath === `/${cat.slug}`;
            return (
              <div key={cat.id} className="relative group">
                <Link
                  href={`/${cat.slug}`}
                  className={`flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium transition-all whitespace-nowrap ${isActive ? 'text-white bg-brand-orange' : 'text-white/70 hover:text-white hover:bg-brand-orange'}`}
                >
                  {cat.name}
                  {cat.subcategories.length > 0 && (
                    <ChevronDown size={13} className="opacity-40 group-hover:rotate-180 group-hover:opacity-80 transition-transform duration-200" />
                  )}
                </Link>
                {cat.subcategories.length > 0 && <MegaMenu category={cat} />}
              </div>
            );
          })}
          <Link
            href="/blog"
            className={`flex items-center h-full px-4 text-[13px] font-medium transition-colors border-r border-white/[0.06] ${
              currentPath?.startsWith('/blog')
                ? 'text-white bg-brand-orange'
                : 'text-white/70 hover:text-white hover:bg-brand-orange'
            }`}
          >
            Actualités
          </Link>
          <div className="ml-auto">
            <Link
              href="/contact"
              className="flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium text-white/70 hover:text-white hover:bg-brand-orange transition-all whitespace-nowrap"
            >
              Contact &amp; Localisation
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
