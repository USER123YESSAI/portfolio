import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/SocialIcons";
import type { SiteSettings } from "@/types";

interface FooterProps {
  settings?: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const social = settings?.social_links;

  return (
    <footer className="border-t transition-colors duration-300" style={{ borderColor: "var(--nav-border)", backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
        {/* Pre-footer Call to Action Card */}
        <div className="rounded-2xl p-8 sm:p-12 mb-16 text-center" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="w-8 h-[1px]" style={{ backgroundColor: "var(--label-color)" }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--label-color)" }}>
              COLLABORATION
            </span>
            <span className="w-8 h-[1px]" style={{ backgroundColor: "var(--label-color)" }} />
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold font-serif-custom mb-3" style={{ color: "var(--heading-color)" }}>
            Vous avez un projet en tête ?
          </h3>
          <p className="max-w-lg mx-auto text-sm sm:text-base mb-8" style={{ color: "var(--body-text)" }}>
            Discutons ensemble de vos besoins et de votre vision technique pour construire une application moderne et pérenne.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold text-sm rounded shadow-sm transition-all"
              style={{ backgroundColor: "var(--btn-primary-bg)" }}
            >
              Me contacter
              <ArrowRight size={16} />
            </Link>
            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded transition-all shadow-xs"
                style={{ backgroundColor: "transparent", color: "var(--btn-secondary-text)", border: "1px solid var(--btn-secondary-border)" }}
              >
                <Mail size={16} />
                {settings.email}
              </a>
            )}
          </div>
        </div>

        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="inline-block text-2xl font-extrabold font-serif-custom mb-1 transition-colors"
              style={{ color: "var(--heading-color)" }}
            >
              YN<span style={{ color: "var(--logo-dot)" }}>.</span>
            </Link>
            <p className="text-sm" style={{ color: "var(--body-text)" }}>
              Développeur Full-Stack & Étudiant à EPF Africa, Dakar
            </p>
          </div>

          <div className="flex items-center gap-4">
            {social?.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border transition-all shadow-xs"
                style={{ backgroundColor: "var(--icon-bg)", borderColor: "var(--border)", color: "var(--icon-color)" }}
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            )}
            {social?.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border transition-all shadow-xs"
                style={{ backgroundColor: "var(--icon-bg)", borderColor: "var(--border)", color: "var(--icon-color)" }}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            )}
            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="p-2.5 rounded-lg border transition-all shadow-xs"
                style={{ backgroundColor: "var(--icon-bg)", borderColor: "var(--border)", color: "var(--icon-color)" }}
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Yessaïn Nanadoumadji. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
