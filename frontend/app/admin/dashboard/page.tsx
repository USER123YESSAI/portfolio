"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Code2,
  Briefcase,
  MessageSquare,
  GraduationCap,
  Award,
  ArrowRight,
  Plus,
} from "lucide-react";
import { getDashboardStats } from "@/lib/api";
import type { DashboardStats } from "@/types";

const statCards = [
  {
    key: "projects" as const,
    label: "Projets",
    href: "/admin/projects",
    icon: FolderKanban,
    badgeColor: "bg-[#0ea5e9] text-white",
  },
  {
    key: "skills" as const,
    label: "Compétences",
    href: "/admin/skills",
    icon: Code2,
    badgeColor: "bg-[#f59e0b] text-white",
  },
  {
    key: "experiences" as const,
    label: "Expériences",
    href: "/admin/experiences",
    icon: Briefcase,
    badgeColor: "bg-indigo-600 text-white",
  },
  {
    key: "educations" as const,
    label: "Formations",
    href: "/admin/educations",
    icon: GraduationCap,
    badgeColor: "bg-sky-700 text-white",
  },
  {
    key: "certifications" as const,
    label: "Certifications",
    href: "/admin/certifications",
    icon: Award,
    badgeColor: "bg-emerald-600 text-white",
  },
  {
    key: "messages" as const,
    label: "Messages reçus",
    href: "/admin/messages",
    icon: MessageSquare,
    badgeColor: "bg-rose-500 text-white",
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10">
      {/* Title & Quick Add Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif-custom text-[#0f172a]">
            Vue d&apos;ensemble
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Gérez facilement l&apos;ensemble du contenu de votre portfolio professionnel.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-semibold rounded-lg transition-all shadow-xs"
          >
            <Plus size={16} />
            <span>Ajouter un projet</span>
          </Link>
          <Link
            href="/admin/skills"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-[#0f172a] border border-[#e2e8f0] text-sm font-semibold rounded-lg transition-all shadow-xs"
          >
            <Plus size={16} />
            <span>Ajouter une compétence</span>
          </Link>
        </div>
      </div>

      {/* Stats 6-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map(({ key, label, href, icon: Icon, badgeColor }) => (
          <Link
            key={key}
            href={href}
            className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-xs hover:shadow-md hover:border-[#0ea5e9] transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
                {label}
              </span>
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${badgeColor}`}
              >
                <Icon size={18} />
              </div>
            </div>

            <div>
              <div className="text-4xl font-extrabold font-serif-custom text-[#0f172a]">
                {loading ? "..." : stats?.[key] ?? 0}
              </div>
              {key === "messages" &&
                stats &&
                stats.unreadMessages > 0 && (
                  <div className="inline-block mt-2 px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                    {stats.unreadMessages} message
                    {stats.unreadMessages > 1 ? "s" : ""} non lu
                    {stats.unreadMessages > 1 ? "s" : ""}
                  </div>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0ea5e9] group-hover:text-[#0284c7] transition-colors">
              <span>Gérer les éléments</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Help / Guide Box */}
      <div className="bg-[#f0f6fb] border border-[#e2e8f0] rounded-xl p-6 sm:p-8">
        <h2 className="text-lg font-bold font-serif-custom text-[#0f172a] mb-2">
          Astuce d&apos;administration
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          Toutes les modifications enregistrées ici (projets, compétences, expériences) sont instantanément synchronisées et visibles sur votre site public.
        </p>
      </div>
    </div>
  );
}
