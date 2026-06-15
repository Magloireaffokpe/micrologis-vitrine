"use client";

import { usePathname } from "next/navigation";
import { useMobileMenu } from '@/hooks/useMobileMenu';
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const { isOpen, open, close } = useMobileMenu();

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen min-w-0 flex flex-col lg:flex-row bg-gray-50 text-brand-dark font-body antialiased">
      <AdminSidebar isOpen={isOpen} onClose={close} />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <AdminHeader onMenuOpen={open} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
