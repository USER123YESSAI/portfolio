import PublicLayout from "@/components/layout/PublicLayout";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import { getProjects, getSettings } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projets - Yessaïn Nanadoumadji",
  description:
    "Découvrez mes projets de développement web et applications full-stack.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  let settings = {};
  let projects = [];

  try {
    [settings, projects] = await Promise.all([getSettings(), getProjects()]);
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
