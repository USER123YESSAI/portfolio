"use client";

import { useState, useMemo, useEffect } from "react";
import type { Project } from "@/types";
import ProjectCard from "@/components/ui/ProjectCard";
import { getProjects } from "@/lib/api";

interface ProjectsGridProps {
  projects: Project[];
  showFilters?: boolean;
}

export default function ProjectsGrid({
  projects: initialProjects,
  showFilters = true,
}: ProjectsGridProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeCategory, setActiveCategory] = useState<string>("Tous");

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  // Synchronisation dynamique en direct : charge TOUS les projets de la base de données
  useEffect(() => {
    let isMounted = true;
    getProjects()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(() => {
        // En cas d'erreur de connexion, conserve les projets actuels
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const allCategories = useMemo(() => {
    // Default categories from screenshot: Tous, Full-Stack, Front-End, Back-End, Mobile
    const defaultOrder = ["Full-Stack", "Front-End", "Back-End", "Mobile"];
    const presentCats = [
      ...new Set(projects.map((p) => p.categorie).filter(Boolean)),
    ] as string[];
    const combined = [
      ...defaultOrder.filter((c) => presentCats.includes(c)),
      ...presentCats.filter((c) => !defaultOrder.includes(c)),
    ];
    return ["Tous", ...combined];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "Tous") return projects;
    return projects.filter((project) => project.categorie === activeCategory);
  }, [projects, activeCategory]);

  return (
    <section id="projets" className="py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Label: —— PROJETS */}
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-[1px]" style={{ backgroundColor: "var(--label-color)" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--label-color)" }}>
            PROJETS
          </span>
        </div>

        {/* Big Serif Heading */}
        <h2 className="text-4xl sm:text-5xl font-bold font-serif-custom mb-6" style={{ color: "var(--heading-color)" }}>
          Réalisations <span className="italic font-serif-custom">&</span> travaux
        </h2>

        {/* Filter Pills Row */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-10">
            {allCategories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={isActive}
                  className="px-3.5 py-1 rounded-full text-xs font-semibold transition-all border"
                  style={isActive ? {
                    backgroundColor: "var(--primary)",
                    color: "white",
                    borderColor: "var(--primary)",
                  } : {
                    backgroundColor: "transparent",
                    color: "var(--body-text)",
                    borderColor: "var(--border)",
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>
        )}

        {/* Projects 3-Column Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <p className="font-bold text-lg mb-1 font-serif-custom" style={{ color: "var(--heading-color)" }}>
              Aucun projet pour le moment dans cette catégorie
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--body-text)" }}>
              Sélectionnez une autre catégorie pour explorer le portfolio.
            </p>
            <button
              onClick={() => setActiveCategory("Tous")}
              className="px-4 py-2 text-white text-xs font-semibold rounded shadow-xs transition-colors"
              style={{ backgroundColor: "var(--badge-primary)" }}
            >
              Afficher tous les projets
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
