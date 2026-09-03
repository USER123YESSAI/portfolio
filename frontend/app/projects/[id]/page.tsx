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
    return { title: project.titre, description: project.description };
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

  return (
    <PublicLayout settings={settings}>
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-8 transition-colors">
            <ArrowLeft size={16} /> Retour aux projets
          </Link>

          {imageUrl && (
            <div className="relative rounded-2xl overflow-hidden mb-8 h-64 sm:h-80">
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

          <div className="flex flex-wrap items-start gap-3 mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold">{project.titre}</h1>
            {project.categorie && (
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {project.categorie}
              </span>
            )}
          </div>

          {project.date_realisation && (
            <p className="text-sm text-muted mb-6">
              Réalisé en {formatFullDate(project.date_realisation)}
            </p>
          )}

          <p className="text-zinc-300 leading-relaxed mb-8">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {parseTechnologies(project.technologies).map((tech: string) => (
              <span key={tech} className="px-3 py-1 bg-border rounded-lg text-sm text-zinc-400">
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            {project.lien_demo && project.lien_demo !== "#" && (
              <a href={project.lien_demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                <ExternalLink size={16} /> Voir la démo
              </a>
            )}
            {project.lien_github && (
              <a href={project.lien_github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg hover:border-primary/50 transition-colors">
                <Github size={16} /> Code source
              </a>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
