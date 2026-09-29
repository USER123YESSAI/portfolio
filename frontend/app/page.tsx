import HomePageClient from "@/components/home/HomePageClient";
import { getProjects, getSettings, getSkills } from "@/lib/api";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import type { SiteSettings, Skill, Project } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let settings: SiteSettings = DEFAULT_SETTINGS;
  let skills: Skill[] = [];
  let projects: Project[] = [];

  try {
    const [fetchedSettings, fetchedSkills, fetchedProjects] = await Promise.all([
      getSettings(),
      getSkills(),
      getProjects(),
    ]);
    if (fetchedSettings && Object.keys(fetchedSettings).length > 0) {
      settings = { ...DEFAULT_SETTINGS, ...fetchedSettings };
    }
    if (fetchedSkills && fetchedSkills.length > 0) {
      skills = fetchedSkills;
    }
    if (fetchedProjects && Array.isArray(fetchedProjects)) {
      projects = fetchedProjects;
    }
  } catch {
    // API unavailable — render with defaults initially
  }

  return (
    <HomePageClient
      initialSettings={settings}
      initialSkills={skills}
      initialProjects={projects}
    />
  );
}
