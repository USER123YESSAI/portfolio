import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Github } from "@/components/ui/SocialIcons";
import PublicLayout from "@/components/layout/PublicLayout";
import { getProject, getSettings, getAssetUrl } from "@/lib/api";
import { formatFullDate, parseTechnologies } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const project = await getProject(Number(id));
    return { title: `${project.titre} - Yessaïn Nanadoumadji`, description: project.description };
  } catch {
    return { title: "Projet introuvable" };
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  let project = null;
  let settings = {};

  try {
    [project, settings] = await Promise.all([
      getProject(Number(id)),
      getSettings(),
    ]);
  } catch {
    notFound();
  }

  if (!project) notFound();

  const imageUrl = getAssetUrl(project.image);
  const siteUrl =
    project.lien_demo && project.lien_demo !== "#"
      ? project.lien_demo
      : project.lien_github && project.lien_github !== "#"
      ? project.lien_github
      : null;

  return (
    <PublicLayout settings={settings}>
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-colors hover:opacity-75"
            style={{ color: "var(--body-text)" }}
          >
            <ArrowLeft size={16} /> Retour aux projets
          </Link>

          {/* Project Image Banner */}
          {imageUrl && (
            <div
              className="relative rounded-2xl overflow-hidden mb-8 h-72 sm:h-96 shadow-lg"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--card)" }}
            >
              <Image
                src={imageUrl}
                alt={project.titre}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 896px"
                priority
              />
            </div>
          )}

          {/* Title & Category */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1
              className="text-3xl sm:text-4xl font-bold font-serif-custom tracking-tight"
              style={{ color: "var(--heading-color)" }}
            >
              {project.titre}
            </h1>
            {project.categorie && (
              <span
                className="px-3 py-1 text-xs font-semibold rounded-full font-mono text-white shadow-xs"
                style={{ backgroundColor: "var(--badge-primary)" }}
              >
                {project.categorie}
              </span>
            )}
          </div>

          {/* Date */}
          {project.date_realisation && (
            <p className="text-sm font-mono mb-6" style={{ color: "var(--body-text)" }}>
              Réalisé en {formatFullDate(project.date_realisation)}
            </p>
          )}

          {/* Description & Detailed Content */}
          <div
            className="rounded-2xl p-6 sm:p-8 mb-8 shadow-xs space-y-4"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <h2
              className="text-lg font-bold font-serif-custom"
              style={{ color: "var(--heading-color)" }}
            >
              À propos de cette réalisation
            </h2>
            <p
              className="text-base sm:text-lg leading-relaxed whitespace-pre-line"
              style={{ color: "var(--body-text)" }}
            >
              {project.description}
            </p>
          </div>

          {/* Technologies */}
          <div className="mb-8">
            <h3
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--heading-color)" }}
            >
              Technologies utilisées
            </h3>
            <div className="flex flex-wrap gap-2">
              {parseTechnologies(project.technologies).map((tech: string) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold"
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

          {/* Action buttons: Voir le site & Code source */}
          <div className="flex flex-wrap gap-4 pt-2">
            {siteUrl && (
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold text-sm shadow-md transition-all hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <ExternalLink size={16} /> Voir le site
              </a>
            )}
            {project.lien_github && project.lien_github !== "#" && (
              <a
                href={project.lien_github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 cursor-pointer border shadow-xs"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--heading-color)",
                }}
              >
                <Github size={16} /> Code source
              </a>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
