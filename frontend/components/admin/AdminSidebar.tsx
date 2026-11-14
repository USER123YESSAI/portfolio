"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projets", icon: FolderKanban },
  { href: "/admin/skills", label: "Compétences", icon: Code2 },
  { href: "/admin/experiences", label: "Expériences", icon: Briefcase },
  { href: "/admin/educations", label: "Formations", icon: GraduationCap },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-[#e2e8f0] min-h-screen flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between">
        <div>
          <Link
            href="/admin/dashboard"
            className="text-xl font-bold font-serif-custom text-[#0f172a] flex items-center gap-1"
          >
            YN<span className="text-[#0ea5e9]">.</span>
            <span className="text-xs font-sans font-bold bg-[#0ea5e9] text-white px-2 py-0.5 rounded-md ml-2 shadow-xs">
              ADMIN
            </span>
          </Link>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Espace de gestion portfolio
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
          Menu principal
        </div>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-[#0ea5e9] text-white font-semibold shadow-xs"
                  : "text-slate-700 hover:text-[#0ea5e9] hover:bg-sky-50 font-medium"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Shortcuts & Logout */}
      <div className="p-4 border-t border-[#e2e8f0] bg-[#f0f6fb]/70 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#0ea5e9] hover:bg-white border border-transparent hover:border-[#e2e8f0] transition-all"
        >
          <span>Voir le site public</span>
          <ExternalLink size={14} />
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer"
        >
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
