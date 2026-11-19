"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowRight, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { getAssetUrl } from "@/lib/api";
import { parseTechnologies } from "@/lib/utils";
import TiltCard from "@/components/gsap/TiltCard";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = getAssetUrl(project.image);
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const shouldReduceMotion = useReducedMotion();

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
    <TiltCard maxTilt={5} className="h-full">
      <motion.article
        layout
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
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
            className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
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
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "var(--bg-subtle)" }}
          >
            <span
              className="text-3xl font-bold font-serif-custom transition-transform duration-300 group-hover:scale-110"
              style={{ color: "var(--primary)" }}
            >
              {project.titre.charAt(0)}
            </span>
          </div>
        )}

        {/* Top-Left Badges (Category & Featured) */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          {project.categorie && (
            <span
              className="px-2.5 py-0.5 rounded-md text-xs font-semibold font-mono shadow-xs text-white"
              style={{ backgroundColor: "var(--badge-primary)" }}
            >
              {project.categorie}
            </span>
          )}
          {project.mis_en_avant && (
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="px-2 py-0.5 rounded-md text-xs font-semibold inline-flex items-center gap-1 shadow-xs text-white"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <Star size={12} className="fill-white" />
              <span>Featured</span>
            </motion.span>
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
          {/* Title with hover color change */}
          <h3
            className="text-xl font-bold font-serif-custom mb-2 transition-colors group-hover:text-[var(--primary)]"
            style={{ color: "var(--heading-color)" }}
          >
            <Link
              href={`/projects/${project.id}`}
              className="hover:opacity-90 transition-opacity"
            >
              {project.titre}
            </Link>
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-4 line-clamp-3"
            style={{ color: "var(--body-text)" }}
          >
            {project.description}
          </p>

          {/* Technologies Row with micro-badges */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {techs.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-xs font-mono font-medium transition-transform group-hover:scale-102"
                style={{
                  backgroundColor: "var(--progress-track)",
                  color: "var(--foreground-muted)",
                  border: "1px solid var(--border)",
                }}
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
            <ArrowRight
              size={14}
              style={{ color: "var(--primary)" }}
              className="group-hover/btn:translate-x-1 transition-transform duration-300"
            />
            <span>Détails</span>
          </Link>

          {/* 2. Bouton Voir le site : redirige directement vers le site du projet */}
          {siteUrl && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:opacity-75"
              style={{ color: "var(--body-text)" }}
            >
              <ExternalLink size={13} />
              <span>Voir le site</span>
            </motion.a>
          )}
        </div>
      </div>
    </motion.article>
    </TiltCard>
  );
}
