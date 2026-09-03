"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { getAssetUrl } from "@/lib/api";
import { parseTechnologies } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = getAssetUrl(project.image);
  const [imgSrc, setImgSrc] = useState(imageUrl);

  useEffect(() => {
    setImgSrc(imageUrl);
  }, [imageUrl]);
  const techs = parseTechnologies(project.technologies);

  // Extraction de l'année
  const year = project.date_realisation
    ? new Date(project.date_realisation).getFullYear()
    : new Date().getFullYear();

  // Lien direct vers le site web du projet (priorité à lien_demo, fallback sur lien_github)
  const siteUrl =
    project.lien_demo && project.lien_demo !== "#"
      ? project.lien_demo
      : project.lien_github && project.lien_github !== "#"
      ? project.lien_github
      : null;

  return (
    <article
      className="rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full group"
      style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
    >
      {/* Top Image Preview (cliquable vers Détails) */}
      <Link
        href={`/projects/${project.id}`}
        className="block relative h-52 overflow-hidden cursor-pointer"
        style={{ backgroundColor: "var(--bg-subtle)" }}
      >
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={project.titre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => {
              if (project.titre.toLowerCase().includes("commerce")) {
                setImgSrc("/images/commerce1.png");
              } else if (project.titre.toLowerCase().includes("portfolio")) {
                setImgSrc("/images/projects/1788370893095-283250163.jpeg");
              } else {
                setImgSrc(null);
              }
            }}
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
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-xl font-bold font-serif-custom mb-2 transition-colors" style={{ color: "var(--heading-color)" }}>
            <Link
              href={`/projects/${project.id}`}
              className="hover:opacity-80 transition-opacity"
            >
              {project.titre}
            </Link>
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

        {/* Footer Actions: Détails & Voir le site */}
        <div
          className="pt-3 flex items-center justify-between text-xs font-semibold"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {/* 1. Bouton Détails : consulte la page détaillée du projet */}
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:opacity-75 font-semibold group/btn"
            style={{ color: "var(--heading-color)" }}
          >
            <ArrowRight size={14} style={{ color: "var(--primary)" }} className="group-hover/btn:translate-x-0.5 transition-transform" />
            <span>Détails</span>
          </Link>

          {/* 2. Bouton Voir le site : redirige directement vers le site du projet */}
          {siteUrl && (
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:opacity-75"
              style={{ color: "var(--body-text)" }}
            >
              <ExternalLink size={13} />
              <span>Voir le site</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
