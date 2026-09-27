"use client";

import { useMemo } from "react";
import { Code2, Layers, Wrench, Users } from "lucide-react";
import type { Skill } from "@/types";

interface SkillsSectionProps {
  skills: Skill[];
}

interface CategoryConfig {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const categoryMeta: Record<string, CategoryConfig> = {
  langages: { label: "Langages", icon: Code2 },
  frameworks: { label: "Frameworks & Libs", icon: Layers },
  outils: { label: "Outils & Méthodes", icon: Wrench },
  soft_skills: { label: "Soft Skills", icon: Users },
};

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const grouped = useMemo(() => {
    // Default categories in specific order from screenshot
    const order = ["langages", "frameworks", "outils", "soft_skills"];
    const result: Record<string, Skill[]> = {
      langages: [],
      frameworks: [],
      outils: [],
      soft_skills: [],
    };

    skills.forEach((skill) => {
      const cat = skill.categorie || "outils";
      if (!result[cat]) result[cat] = [];
      result[cat].push(skill);
    });

    return order.map((key) => {
      const meta = categoryMeta[key] || { label: key, icon: Code2 };
      return {
        key,
        label: meta.label,
        Icon: meta.icon,
        items: result[key] || [],
      };
    });
  }, [skills]);

  return (
    <section id="competences" className="py-20 sm:py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Label: —— COMPÉTENCES */}
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-[1px]" style={{ backgroundColor: "var(--label-color)" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--label-color)" }}>
            COMPÉTENCES
          </span>
        </div>

        {/* Big Serif Heading */}
        <h2 className="text-4xl sm:text-5xl font-bold font-serif-custom mb-12" style={{ color: "var(--heading-color)" }}>
          Ce que je maîtrise
        </h2>

        {/* 4-Column Grid of Cream Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {grouped.map(({ key, label, Icon, items }) => (
            <div
              key={key}
              className="rounded-2xl p-5 shadow-sm flex flex-col transition-colors duration-300"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            >
              {/* Header Pill */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold font-mono shadow-xs" style={{ backgroundColor: "var(--bg-subtle)", color: "var(--primary)", border: "1px solid var(--border)" }}>
                  <Icon size={16} />
                  <span>{label}</span>
                </span>
              </div>

              {/* Skills Progress Bars List */}
              <div className="space-y-5">
                {items.length > 0 ? (
                  items.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold" style={{ color: "var(--heading-color)" }}>
                          {skill.nom}
                        </span>
                        <span className="text-xs font-semibold font-mono" style={{ color: "var(--body-text)" }}>
                          {skill.niveau}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--progress-track)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${skill.niveau}%`, background: `linear-gradient(to right, var(--progress-fill-start), var(--progress-fill-end))` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    Aucune compétence dans cette catégorie
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
