"use client";

import { useMemo } from "react";
import { Code2, Layers, Wrench, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();

  const grouped = useMemo(() => {
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
    <section id="competences" className="py-20 sm:py-24 scroll-mt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Label: —— COMPÉTENCES */}
        <motion.div
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-2"
        >
          <span
            className="w-8 h-[1px]"
            style={{ backgroundColor: "var(--label-color)" }}
          />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--label-color)" }}
          >
            COMPÉTENCES
          </span>
        </motion.div>

        {/* Big Serif Heading */}
        <motion.h2
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold font-serif-custom mb-12"
          style={{ color: "var(--heading-color)" }}
        >
          Ce que je maîtrise
        </motion.h2>

        {/* 4-Column Grid of Cards with Staggered Entrance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {grouped.map(({ key, label, Icon, items }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: shouldReduceMotion ? 0 : index * 0.1,
                ease: "easeOut",
              }}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      y: -6,
                      boxShadow: "0 14px 30px -10px rgba(0,0,0,0.1)",
                      transition: { duration: 0.2 },
                    }
              }
              className="rounded-2xl p-5 shadow-sm flex flex-col transition-colors duration-300 group cursor-default"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Header Pill */}
              <div className="mb-6">
                <span
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold font-mono shadow-xs transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundColor: "var(--bg-subtle)",
                    color: "var(--primary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </span>
              </div>

              {/* Skills Progress Bars List with animated reveal */}
              <div className="space-y-5">
                {items.length > 0 ? (
                  items.map((skill, sIdx) => (
                    <div key={skill.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="text-sm font-bold transition-colors group-hover:text-[var(--heading-color)]"
                          style={{ color: "var(--heading-color)" }}
                        >
                          {skill.nom}
                        </span>
                        <span
                          className="text-xs font-semibold font-mono"
                          style={{ color: "var(--body-text)" }}
                        >
                          {skill.niveau}%
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: "var(--progress-track)" }}
                      >
                        <motion.div
                          initial={shouldReduceMotion ? { width: `${skill.niveau}%` } : { width: 0 }}
                          whileInView={{ width: `${skill.niveau}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1,
                            delay: shouldReduceMotion ? 0 : 0.2 + sIdx * 0.08,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(to right, var(--progress-fill-start), var(--progress-fill-end))`,
                          }}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
