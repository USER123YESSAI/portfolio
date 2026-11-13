"use client";

import { Award, Briefcase, GraduationCap, ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import type { Experience, Education, Certification } from "@/types";

interface TimelineProps {
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
}

type TimelineItem = {
  id: string;
  type: "experience" | "education" | "certification";
  title: string;
  subtitle: string;
  start: string;
  end?: string | null;
  description?: string;
  link?: string;
};

export default function Timeline({
  experiences,
  educations,
  certifications,
}: TimelineProps) {
  const shouldReduceMotion = useReducedMotion();

  const items: TimelineItem[] = [
    ...experiences.map((e) => ({
      id: `exp-${e.id}`,
      type: "experience" as const,
      title: e.poste,
      subtitle: e.entreprise,
      start: e.date_debut,
      end: e.date_fin,
      description: e.description,
    })),
    ...educations.map((e) => ({
      id: `edu-${e.id}`,
      type: "education" as const,
      title: e.intitule,
      subtitle: e.etablissement,
      start: e.date_debut,
      end: e.date_fin,
      description: e.description,
    })),
    ...certifications.map((c) => ({
      id: `cert-${c.id}`,
      type: "certification" as const,
      title: c.nom,
      subtitle: c.organisme,
      start: c.date_obtention,
      end: null,
      link: c.lien_justificatif,
    })),
  ].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

  const icons = {
    experience: Briefcase,
    education: GraduationCap,
    certification: Award,
  };

  const badgeStyles = {
    experience: "bg-[#8b5cf6] text-white",
    education: "bg-[#0ea5e9] text-white",
    certification:
      "border border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10",
  };

  const badgeLabels = {
    experience: "Expérience",
    education: "Formation",
    certification: "Certification",
  };

  return (
    <div className="relative">
      {/* Vertical Animated Timeline Line */}
      <motion.div
        initial={shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute left-6 top-4 bottom-4 w-[2px] hidden sm:block origin-top"
        style={{ backgroundColor: "var(--border)" }}
      />

      <div className="space-y-8">
        {items.map((item, index) => {
          const Icon = icons[item.type];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: shouldReduceMotion ? 0 : index * 0.08,
                ease: "easeOut",
              }}
              className="relative flex gap-6 group"
            >
              {/* Icon marker with micro-bounce on hover */}
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 350, damping: 15 }}
                className="hidden sm:flex w-12 h-12 rounded-xl items-center justify-center shrink-0 z-10 shadow-xs transition-colors duration-300"
                style={{
                  backgroundColor: "var(--icon-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--icon-color)",
                }}
              >
                <Icon size={20} />
              </motion.div>

              {/* Card content with subtle hover slide */}
              <motion.div
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        x: 6,
                        boxShadow: "0 16px 32px -10px rgba(0,0,0,0.12)",
                        transition: { duration: 0.2 },
                      }
                }
                className="rounded-2xl p-6 sm:p-8 flex-1 shadow-sm transition-all duration-300"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-md font-semibold font-mono ${badgeStyles[item.type]}`}
                      >
                        {badgeLabels[item.type]}
                      </span>
                      <span
                        className="text-xs font-mono"
                        style={{ color: "var(--body-text)" }}
                      >
                        {formatDate(item.start)} — {formatDate(item.end)}
                      </span>
                    </div>
                    <h3
                      className="font-bold text-lg sm:text-xl font-serif-custom"
                      style={{ color: "var(--heading-color)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm font-semibold mt-0.5"
                      style={{ color: "var(--primary)" }}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {item.description && (
                  <p
                    className="text-sm leading-relaxed mt-3"
                    style={{ color: "var(--body-text)" }}
                  >
                    {item.description}
                  </p>
                )}

                {item.link && item.link !== "#" && (
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold mt-4 px-3 py-1.5 rounded transition-all"
                    style={{
                      color: "var(--primary)",
                      backgroundColor: "var(--bg-subtle)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    Voir le certificat
                    <ExternalLink size={13} />
                  </motion.a>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
