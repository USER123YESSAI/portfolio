"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Github } from "@/components/ui/SocialIcons";
import { getAssetUrl } from "@/lib/api";
import { parseTechnologies } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = getAssetUrl(project.image);
  const techs = parseTechnologies(project.technologies);

  // Extract year from date_realisation or default to current year
  const year = project.date_realisation
    ? new Date(project.date_realisation).getFullYear()
    : new Date().getFullYear();

  return (
    <article
      className="rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full group"
      style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
    >
      {/* Top Image Preview */}
      <div className="relative h-52 overflow-hidden" style={{ backgroundColor: "var(--bg-subtle)" }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={project.titre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--bg-subtle)" }}>
            <span className="text-3xl font-bold font-serif-custom" style={{ color: "var(--primary)" }}>
              {project.titre.charAt(0)}
            </span>
          </div>
        )}

        {/* Top-Left Badges (Category & Featured) */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          {project.categorie && (
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold font-mono shadow-xs text-white" style={{ backgroundColor: "var(--badge-primary)" }}>
              {project.categorie}
            </span>
          )}
          {project.mis_en_avant && (
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold inline-flex items-center gap-1 shadow-xs text-white" style={{ backgroundColor: "var(--primary)" }}>
              ★ Featured
            </span>
          )}
        </div>

        {/* Bottom-Right Year Badge */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="text-white/90 font-mono text-xs font-semibold drop-shadow-md">
            {year}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-xl font-bold font-serif-custom mb-2 group-hover:opacity-80 transition-colors" style={{ color: "var(--heading-color)" }}>
            {project.titre}
          </h3>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: "var(--body-text)" }}>
            {project.description}
          </p>

          {/* Technologies Row */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {techs.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-xs font-mono font-medium"
                style={{ backgroundColor: "var(--progress-track)", color: "var(--foreground-muted)", border: "1px solid var(--border)" }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="pt-3 flex items-center gap-5 text-xs font-semibold" style={{ borderTop: "1px solid var(--border)", color: "var(--heading-color)" }}>
          {project.lien_demo && project.lien_demo !== "#" && (
            <a
              href={project.lien_demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:opacity-70"
            >
              <ExternalLink size={13} />
              <span>Démo live</span>
            </a>
          )}
          {project.lien_github && (
            <a
              href={project.lien_github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:opacity-70"
            >
              <Github size={13} />
              <span>Code source</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
