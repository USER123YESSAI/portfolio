"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Project } from "@/types";
import ProjectCard from "@/components/ui/ProjectCard";

interface ProjectsGridProps {
  projects: Project[];
  showFilters?: boolean;
}

export default function ProjectsGrid({
  projects,
  showFilters = true,
}: ProjectsGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const shouldReduceMotion = useReducedMotion();

  const allCategories = useMemo(() => {
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
    <section id="projets" className="py-20 sm:py-24 scroll-mt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Label: —— PROJETS */}
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
            PROJETS
          </span>
        </motion.div>

        {/* Big Serif Heading */}
        <motion.h2
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold font-serif-custom mb-6"
          style={{ color: "var(--heading-color)" }}
        >
          Réalisations <span className="italic font-serif-custom">&</span>{" "}
          travaux
        </motion.h2>

        {/* Filter Pills Row avec indicateur de glissement fluide */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap items-center gap-2 mb-10"
          >
            {allCategories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  aria-pressed={isActive}
                  className="relative px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border"
                  style={{
                    borderColor: isActive ? "transparent" : "var(--border)",
                    color: isActive ? "white" : "var(--body-text)",
                  }}
                >
                  {/* Glissement fluide du fond actif */}
                  {isActive && (
                    <motion.span
                      layoutId="activeFilterPill"
                      className="absolute inset-0 rounded-full -z-10 shadow-sm"
                      style={{ backgroundColor: "var(--primary)" }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Projects 3-Column Grid avec transition de disposition fluide */}
        <motion.div layout className="min-h-[280px]">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl p-12 text-center"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="font-bold text-lg mb-1 font-serif-custom"
                  style={{ color: "var(--heading-color)" }}
                >
                  Aucun projet trouvé dans cette catégorie
                </p>
                <p className="text-sm" style={{ color: "var(--body-text)" }}>
                  Sélectionnez un autre filtre ou consultez l'ensemble des
                  réalisations.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
