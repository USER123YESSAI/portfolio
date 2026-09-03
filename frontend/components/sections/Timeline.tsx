import { Award, Briefcase, GraduationCap, ExternalLink } from "lucide-react";
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
    certification: "border border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10",
  };

  const badgeLabels = {
    experience: "Expérience",
    education: "Formation",
    certification: "Certification",
  };

  return (
    <div className="relative">
      {/* Vertical Timeline Line */}
      <div className="absolute left-6 top-4 bottom-4 w-[2px] hidden sm:block" style={{ backgroundColor: "var(--border)" }} />

      <div className="space-y-8">
        {items.map((item) => {
          const Icon = icons[item.type];
          return (
            <div key={item.id} className="relative flex gap-6 group">
              {/* Icon marker */}
              <div
                className="hidden sm:flex w-12 h-12 rounded-xl items-center justify-center shrink-0 z-10 shadow-xs"
                style={{ backgroundColor: "var(--icon-bg)", border: "1px solid var(--border)", color: "var(--icon-color)" }}
              >
                <Icon size={20} />
              </div>

              {/* Card content */}
              <div
                className="rounded-2xl p-6 sm:p-8 flex-1 shadow-sm transition-colors duration-300"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-md font-semibold font-mono ${badgeStyles[item.type]}`}
                      >
                        {badgeLabels[item.type]}
                      </span>
                      <span className="text-xs font-mono" style={{ color: "var(--body-text)" }}>
                        {formatDate(item.start)} — {formatDate(item.end)}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg sm:text-xl font-serif-custom" style={{ color: "var(--heading-color)" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--primary)" }}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {item.description && (
                  <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--body-text)" }}>
                    {item.description}
                  </p>
                )}

                {item.link && item.link !== "#" && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold mt-4 px-3 py-1.5 rounded transition-all"
                    style={{ color: "var(--primary)", backgroundColor: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                  >
                    Voir le certificat
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
