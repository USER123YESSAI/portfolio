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
    badgeColor: "bg-[#1a3826] text-white",
  },
  {
    key: "skills" as const,
    label: "Compétences",
    href: "/admin/skills",
    icon: Code2,
    badgeColor: "bg-[#b45309] text-white",
  },
  {
    key: "experiences" as const,
    label: "Expériences",
    href: "/admin/experiences",
    icon: Briefcase,
    badgeColor: "bg-gray-800 text-white",
  },
  {
    key: "educations" as const,
    label: "Formations",
    href: "/admin/educations",
    icon: GraduationCap,
    badgeColor: "bg-blue-800 text-white",
  },
  {
    key: "certifications" as const,
    label: "Certifications",
    href: "/admin/certifications",
    icon: Award,
    badgeColor: "bg-amber-800 text-white",
  },
  {
    key: "messages" as const,
    label: "Messages reçus",
    href: "/admin/messages",
    icon: MessageSquare,
    badgeColor: "bg-red-800 text-white",
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
          <h1 className="text-3xl font-bold font-serif-custom text-[#111827]">
            Vue d&apos;ensemble
          </h1>
          <p className="text-[#4b5563] text-sm mt-1">
            Gérez facilement l&apos;ensemble du contenu de votre portfolio professionnel.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1a3826] hover:bg-[#142a1d] text-white text-sm font-semibold rounded-lg transition-all shadow-xs"
          >
            <Plus size={16} />
            <span>Ajouter un projet</span>
          </Link>
          <Link
            href="/admin/skills"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-100 text-[#111827] border border-[#e5dccb] text-sm font-semibold rounded-lg transition-all shadow-xs"
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
            className="bg-white border border-[#e5dccb] rounded-xl p-6 shadow-xs hover:shadow-md hover:border-[#1a3826] transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-gray-500">
                {label}
              </span>
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${badgeColor}`}
              >
                <Icon size={18} />
              </div>
            </div>

            <div>
              <div className="text-4xl font-extrabold font-serif-custom text-[#111827]">
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

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#1a3826] group-hover:text-[#b45309] transition-colors">
              <span>Gérer les éléments</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Help / Guide Box */}
      <div className="bg-[#f3ece0]/60 border border-[#e5dccb] rounded-xl p-6 sm:p-8">
        <h2 className="text-lg font-bold font-serif-custom text-[#111827] mb-2">
          Astuce d&apos;administration
        </h2>
        <p className="text-sm text-[#4b5563] leading-relaxed max-w-2xl">
          Toutes les modifications enregistrées ici (projets, compétences, expériences) sont instantanément synchronisées et visibles sur votre site public.
        </p>
      </div>
    </div>
  );
}
