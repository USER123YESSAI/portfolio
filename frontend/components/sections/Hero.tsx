"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/SocialIcons";
import { getAssetUrl } from "@/lib/api";
import type { SiteSettings } from "@/types";

interface HeroProps {
  settings: SiteSettings;
}

export default function Hero({ settings }: HeroProps) {
  const photoUrl = getAssetUrl(settings.profile_photo ?? undefined) || "/images/profil.png";
  const [imgSrc, setImgSrc] = useState(photoUrl);

  useEffect(() => {
    setImgSrc(photoUrl);
  }, [photoUrl]);

  const githubUrl = settings.social_links?.github || "https://github.com/YessainDev";
  const linkedinUrl = settings.social_links?.linkedin || "https://linkedin.com/in/yessain";
  const emailAddress = settings.email || "nanadoumadjiyessain@gmail.com";

  return (
    <section id="accueil" className="relative pt-12 sm:pt-16 pb-0 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center pb-16">
          {/* Left Column: Typography, Bio & Buttons */}
          <div className="lg:col-span-7 space-y-6">
            {/* Availability Badge */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px]" style={{ backgroundColor: "var(--label-color)" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--label-color)" }}>
                DISPONIBLE POUR STAGE / ALTERNANCE
              </span>
            </div>

            {/* Serif Name Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-serif-custom tracking-tight leading-[1.05]" style={{ color: "var(--heading-color)" }}>
              Yessaïn <br />
              Nanadoumadji
            </h1>

            {/* Subtitle */}
            <h2 className="text-xl sm:text-2xl font-serif-custom italic" style={{ color: "var(--accent-text)" }}>
              {settings.hero_title || "Développeur Full-Stack"}
            </h2>

            {/* Bio text */}
            <p className="text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: "var(--body-text)" }}>
              {settings.bio ||
                "Jeune diplômé en Conception des Systèmes d’Information à EPF Africa, Dakar. Je conçois des applications web modernes, du back-end robuste aux interfaces soignées — avec le souci du code propre, maintenable et utile."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-white font-semibold text-sm rounded shadow-sm transition-all hover:opacity-90 hover:shadow-md group"
                style={{ backgroundColor: "var(--btn-primary-bg)" }}
              >
                <span>Voir mes projets</span>
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent font-semibold text-sm rounded transition-all hover:bg-white/10"
                style={{ color: "var(--btn-secondary-text)", border: "1px solid var(--btn-secondary-border)" }}
              >
                <Mail size={15} />
                <span>Me contacter</span>
              </Link>
            </div>

            {/* Social Links Row */}
            <div className="flex items-center gap-6 pt-2 text-sm font-medium" style={{ color: "var(--body-text)" }}>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:opacity-80"
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:opacity-80"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </a>
              <a
                href={`mailto:${emailAddress}`}
                className="flex items-center gap-1.5 transition-colors hover:opacity-80"
              >
                <Mail size={16} />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Right Column: Photo Card with bottom-left location pill */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-72 h-80 sm:w-80 sm:h-96">
              {/* Subtle background frame offset */}
              <div className="absolute inset-0 rounded-3xl -rotate-2 transform" style={{ backgroundColor: "var(--card)" }} />

              {/* Photo Image Card */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg" style={{ border: "1px solid var(--border)" }}>
                <Image
                  src={imgSrc}
                  alt="Yessaïn Nanadoumadji"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 288px, 320px"
                  priority
                  onError={() => setImgSrc("/images/profil.png")}
                />
              </div>

              {/* Floating Bottom-Left Location Card */}
              <div className="absolute -bottom-5 left-4 px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2.5 z-10" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="text-red-500">
                  <MapPin size={18} className="fill-red-500 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color: "var(--heading-color)" }}>
                    {settings.location || "Dakar, Sénégal"}
                  </div>
                  <div className="text-[11px]" style={{ color: "var(--body-text)" }}>EPF Africa</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 4-Column Stats Strip */}
      <div className="w-full border-t border-b mt-8" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4">
          <div className="py-6 px-4 text-center border-r" style={{ borderColor: "var(--border)" }}>
            <div className="text-2xl sm:text-3xl font-bold font-serif-custom" style={{ color: "var(--heading-color)" }}>
              2+
            </div>
            <div className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--body-text)" }}>
              Années de code
            </div>
          </div>

          <div className="py-6 px-4 text-center border-r" style={{ borderColor: "var(--border)" }}>
            <div className="text-2xl sm:text-3xl font-bold font-serif-custom" style={{ color: "var(--heading-color)" }}>
              8+
            </div>
            <div className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--body-text)" }}>
              Projets réalisés
            </div>
          </div>

          <div className="py-6 px-4 text-center border-r" style={{ borderColor: "var(--border)" }}>
            <div className="text-2xl sm:text-3xl font-bold font-serif-custom" style={{ color: "var(--heading-color)" }}>
              9+
            </div>
            <div className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--body-text)" }}>
              Technologies
            </div>
          </div>

          <div className="py-6 px-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold font-serif-custom" style={{ color: "var(--primary)" }}>
              2026
            </div>
            <div className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--body-text)" }}>
              Diplôme Conception des Systèmes d’Information
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
