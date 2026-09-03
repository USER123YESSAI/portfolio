import PublicLayout from "@/components/layout/PublicLayout";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import { getProjects, getSettings } from "@/lib/api";
import { DEFAULT_SETTINGS, DEFAULT_PROJECTS } from "@/lib/defaults";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projets - Yessaïn Nanadoumadji",
  description:
    "Découvrez mes projets de développement web et applications full-stack.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  let settings = DEFAULT_SETTINGS;
  let projects = DEFAULT_PROJECTS;

  try {
    const [fetchedSettings, fetchedProjects] = await Promise.all([getSettings(), getProjects()]);
    if (fetchedSettings && Object.keys(fetchedSettings).length > 0) {
      settings = { ...DEFAULT_SETTINGS, ...fetchedSettings };
    }
    if (fetchedProjects && fetchedProjects.length > 0) {
      projects = fetchedProjects;
    }
  } catch {
    // API unavailable
  }

  return (
    <PublicLayout settings={settings}>
      <div className="py-8">
        <ProjectsGrid projects={projects} showFilters={true} />
      </div>
    </PublicLayout>
  );
}
