"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Bell, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Tableau de bord",
  "/admin/projects": "Gestion des Projets",
  "/admin/skills": "Gestion des Compétences",
  "/admin/experiences": "Expériences professionnelles",
  "/admin/educations": "Formations académiques",
  "/admin/certifications": "Certifications & Diplômes",
  "/admin/messages": "Messages reçus",
  "/admin/settings": "Paramètres généraux",
};

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const { loading, user } = useAuth(!isLoginPage);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f4ec]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-[#1a3826] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-[#4b5563]">
            Chargement de l&apos;espace administrateur...
          </span>
        </div>
      </div>
    );
  }

  const pageTitle = pageTitles[pathname] ?? "";

  return (
    <div className="flex min-h-screen bg-[#f7f4ec] text-[#111827]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10">
            <AdminSidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#e5dccb] px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
              <span className="text-gray-400 font-normal">Administration /</span>
              <span>{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/messages"
              className="p-2 text-gray-500 hover:text-[#1a3826] hover:bg-gray-100 rounded-lg transition-colors relative"
              title="Notifications & Messages"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </Link>
            <Link
              href="/"
              target="_blank"
              className="p-2 text-gray-500 hover:text-[#1a3826] hover:bg-gray-100 rounded-lg transition-colors hidden sm:inline-flex"
              title="Voir le site public"
              aria-label="Voir le site public"
            >
              <ExternalLink size={18} />
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f3ece0] border border-[#e5dccb] rounded-full text-xs font-semibold text-[#1a3826]">
              <User size={14} />
              <span>{user?.nom ?? "Administrateur"}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
