"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, MapPin, Sparkles, GraduationCap } from "lucide-react";
import { getAssetUrl } from "@/lib/api";
import type { SiteSettings } from "@/types";

interface AboutSectionProps {
  settings: SiteSettings;
}

const defaultQualities = [
  {
    title: "Rigueur technique",
    desc: "Code propre, architecture modulaire et respect des bonnes pratiques.",
  },
  {
    title: "Apprentissage rapide",
    desc: "Curiosité active et montée en compétence fluide sur de nouvelles stacks.",
  },
  {
    title: "Communication professionnelle",
    desc: "Capacité d'écoute, reporting clair et collaboration efficace en équipe.",
  },
  {
    title: "Résolution de problèmes",
    desc: "Esprit d'analyse pour transformer des défis complexes en solutions viables.",
  },
];

export default function AboutSection({ settings }: AboutSectionProps) {
  const photoUrl = getAssetUrl(settings.about_photo || settings.profile_photo) || "/images/about.png";
  const [imgSrc, setImgSrc] = useState(photoUrl);

  useEffect(() => {
    setImgSrc(photoUrl);
  }, [photoUrl]);

  const title =
    settings.about_title || "Un profil full stack dans le concret.";
  const description =
    settings.about_text ||
    "Jeune diplômé en Conception des Systèmes d’Information à l'EPF Africa de Dakar, je conçois et développe des interfaces React dynamiques, des API REST performantes et des architectures robustes connectées à des bases de données relationnelles.";
  const languages =
    settings.about_languages || "Français (courant), Anglais technique";
  const location = settings.location || "Dakar, Sénégal";

  return (
    <section id="a-propos" className="py-20 sm:py-24 transition-colors duration-300 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          {/* Left Column: Presentation + Photo + Location */}
          <div className="lg:col-span-6 space-y-6">
            {/* Label */}
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-[1px]"
                style={{ backgroundColor: "var(--label-color)" }}
              />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--label-color)" }}
              >
                À PROPOS
              </span>
            </div>

            {/* Title */}
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-custom tracking-tight leading-tight"
              style={{ color: "var(--heading-color)" }}
            >
              {title}
            </h2>

            {/* Photo & Bio layout */}
            <div className="flex flex-col sm:flex-row gap-6 items-start pt-2">
              {/* Photo Box */}
              <div className="relative shrink-0 w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden shadow-md group"
                   style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <Image
                  src={imgSrc}
                  alt="Photo À propos - Yessaïn Nanadoumadji"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 144px, 160px"
                  onError={() => setImgSrc("/images/about.png")}
                />
              </div>

              {/* Text & Location */}
              <div className="space-y-4 flex-1">
                <p
                  className="text-base sm:text-lg leading-relaxed"
                  style={{ color: "var(--body-text)" }}
                >
                  {description}
                </p>

                <div className="flex items-center gap-2 text-sm font-semibold pt-1"
                     style={{ color: "var(--heading-color)" }}>
                  <MapPin size={18} className="text-red-500 fill-red-500/20 shrink-0" />
                  <span>{location}</span>
                </div>
              </div>
            </div>

            {/* Academic badge highlight */}
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--heading-color)",
              }}
            >
              <GraduationCap size={16} style={{ color: "var(--primary)" }} />
              <span>Licence en Conception des Systèmes d’Information — EPF Africa, Dakar</span>
            </div>
          </div>

          {/* Right Column: 2x2 Qualities Grid + Languages Box */}
          <div className="lg:col-span-6 space-y-4 lg:pt-8">
            {/* 2x2 Grid of Strengths */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {defaultQualities.map((q, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md flex items-start gap-3.5 group"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      backgroundColor: "var(--bg-subtle)",
                      color: "var(--primary)",
                    }}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h3
                      className="text-sm font-bold font-serif-custom mb-1 group-hover:text-primary transition-colors"
                      style={{ color: "var(--heading-color)" }}
                    >
                      {q.title}
                    </h3>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--body-text)" }}
                    >
                      {q.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Languages Card */}
            <div
              className="p-5 sm:p-6 rounded-2xl shadow-xs transition-colors duration-300 flex items-center gap-3"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: "var(--primary)" }}
              />
              <p className="text-sm font-medium" style={{ color: "var(--heading-color)" }}>
                <strong className="font-semibold">Langues :</strong>{" "}
                <span style={{ color: "var(--body-text)" }}>{languages}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
