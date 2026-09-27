import PublicLayout from "@/components/layout/PublicLayout";
import Timeline from "@/components/sections/Timeline";
import {
  getExperiences,
  getEducations,
  getCertifications,
  getSettings,
} from "@/lib/api";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parcours",
  description: "Mon parcours professionnel, formations académiques et certifications.",
};

export const revalidate = 60;

export default async function JourneyPage() {
  let settings = DEFAULT_SETTINGS;
  let experiences = [];
  let educations = [];
  let certifications = [];

  try {
    const [fetchedSettings, fetchedExp, fetchedEdu, fetchedCert] = await Promise.all([
      getSettings(),
      getExperiences(),
      getEducations(),
      getCertifications(),
    ]);
    if (fetchedSettings && Object.keys(fetchedSettings).length > 0) {
      settings = { ...DEFAULT_SETTINGS, ...fetchedSettings };
    }
    if (fetchedExp) experiences = fetchedExp;
    if (fetchedEdu) educations = fetchedEdu;
    if (fetchedCert) certifications = fetchedCert;
  } catch {
    // API unavailable
  }

  return (
    <PublicLayout settings={settings}>
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Label: —— PARCOURS */}
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-[1px]" style={{ backgroundColor: "var(--label-color)" }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--label-color)" }}>
              PARCOURS
            </span>
          </div>

          <div className="mb-14">
            <h1 className="text-4xl sm:text-5xl font-bold font-serif-custom mb-4" style={{ color: "var(--heading-color)" }}>
              Mon Parcours
            </h1>
            <p className="text-base sm:text-lg" style={{ color: "var(--body-text)" }}>
              Expériences professionnelles, cursus académique et certifications techniques.
            </p>
          </div>
          <Timeline
            experiences={experiences}
            educations={educations}
            certifications={certifications}
          />
        </div>
      </section>
    </PublicLayout>
  );
}
