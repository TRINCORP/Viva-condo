"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Building2, Users, BarChart3, Menu as MenuIcon, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import Button from "./ui/Button";

export default function Menu() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/condominios", label: "Condomínios", icon: Building2 },
    { href: "/usuarios", label: "Usuários", icon: Users },
  ];

  const isActive = (href: string) => pathname?.startsWith(href);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      router.replace("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">VivaCondo</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="px-3 py-6 flex-1">
        <ul className="space-y-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all
                    ${
                      active
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="px-3 py-6 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          disabled={loading}
          variant="ghost"
          size="md"
          fullWidth
          className="justify-start"
          icon={<LogOut className="w-5 h-5" />}
        >
          {loading ? "Saindo..." : "Sair"}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white flex-col border-r border-gray-200 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900">VivaCondo</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MenuIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white z-40 flex flex-col border-t border-gray-200">
          <SidebarContent />
        </div>
      )}

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
