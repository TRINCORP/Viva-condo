import type { Metadata } from "next";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { createClient } from "@/utils/supabase/server";
import Menu from "@/components/menu";
import { ToastProvider } from "@/components/toastNotification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VivaCondo - Gestão Condominial",
  description: "Aplicação moderna de gestão de condomínios com interface intuitiva e segura",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userLogged = Boolean(session);

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased bg-gray-50 text-gray-900">
        <ToastProvider>
          <div className="min-h-screen w-full flex flex-col lg:flex-row">

            {/* Sidebar Desktop */}
            {userLogged && (
              <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 z-40">
                <Menu />
              </aside>
            )}

            {/* Sidebar Mobile */}
            {userLogged && (
              <div className="lg:hidden">
                <Menu />
              </div>
            )}

            {/* Main content */}
            <main
              className={`flex-1 w-full transition-all ${
                userLogged ? "lg:ml-64" : ""
              }`}
            >
              <div className="pt-16 lg:pt-0 min-h-screen">
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
