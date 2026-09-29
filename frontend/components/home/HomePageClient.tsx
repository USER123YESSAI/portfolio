"use client";

import { useEffect, useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import Hero from "@/components/sections/Hero";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import { getProjects, getSettings, getSkills } from "@/lib/api";
import type { SiteSettings, Skill, Project } from "@/types";

interface HomePageClientProps {
  initialSettings: SiteSettings;
  initialSkills: Skill[];
  initialProjects: Project[];
}

export default function HomePageClient({
  initialSettings,
  initialSkills,
  initialProjects,
}: HomePageClientProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Synchronisation dynamique côté client pour garantir l'affichage immédiat des mises à jour admin
  useEffect(() => {
    getSettings()
      .then((freshSettings) => {
        if (freshSettings && Object.keys(freshSettings).length > 0) {
          setSettings((prev) => ({ ...prev, ...freshSettings }));
        }
      })
      .catch(() => {});

    getSkills()
      .then((freshSkills) => {
        if (freshSkills && freshSkills.length > 0) {
          setSkills(freshSkills);
        }
      })
      .catch(() => {});

    getProjects()
      .then((freshProjects) => {
        if (freshProjects && Array.isArray(freshProjects) && freshProjects.length > 0) {
          setProjects(freshProjects);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <PublicLayout settings={settings}>
      <Hero settings={settings} />
      <AboutSection settings={settings} />
      <SkillsSection skills={skills} />
      <ProjectsGrid projects={projects} showFilters={true} />

      {settings.career_goal && (
        <section className="py-20 sm:py-24 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div
              className="rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto transition-colors duration-300 shadow-sm"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="w-8 h-[1px]" style={{ backgroundColor: "var(--label-color)" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--label-color)" }}>
                  OBJECTIF
                </span>
                <span className="w-8 h-[1px]" style={{ backgroundColor: "var(--label-color)" }} />
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold font-serif-custom mb-4"
                style={{ color: "var(--heading-color)" }}
              >
                Objectif professionnel
              </h2>
              <p
                className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto italic font-serif-custom"
                style={{ color: "var(--body-text)" }}
              >
                &ldquo;{settings.career_goal}&rdquo;
              </p>
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
