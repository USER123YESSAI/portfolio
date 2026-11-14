"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, MapPin, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
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
  const photoUrl =
    getAssetUrl(settings.about_photo || settings.profile_photo) ||
    "/images/about.png";
  const [imgSrc, setImgSrc] = useState(photoUrl);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setImgSrc(photoUrl);
  }, [photoUrl]);

  const title =
    settings.about_title || "Un profil full stack dans le concret.";
  const description =
    settings.about_text ||
    "Jeune diplômé en Conception des Systèmes d’Information à l'ISI de Dakar, je conçois et développe des interfaces React dynamiques, des API REST performantes et des architectures robustes connectées à des bases de données relationnelles.";
  const languages =
    settings.about_languages || "Français (courant), Anglais technique";
  const location = settings.location || "Dakar, Sénégal";

  return (
    <section
      id="a-propos"
      className="py-20 sm:py-24 transition-colors duration-300 scroll-mt-24 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          {/* Left Column: Presentation + Photo + Location */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6"
          >
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
              {/* Photo Box with interactive hover */}
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative shrink-0 w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden shadow-md group cursor-pointer"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <Image
                  src={imgSrc}
                  alt="Photo À propos - Yessaïn Nanadoumadji"
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-500"
                  sizes="(max-width: 640px) 144px, 160px"
                  onError={() => setImgSrc("/images/about.png")}
                />
              </motion.div>

              {/* Text & Location */}
              <div className="space-y-4 flex-1">
                <p
                  className="text-base sm:text-lg leading-relaxed"
                  style={{ color: "var(--body-text)" }}
                >
                  {description}
                </p>

                <div
                  className="flex items-center gap-2 text-sm font-semibold pt-1"
                  style={{ color: "var(--heading-color)" }}
                >
                  <MapPin
                    size={18}
                    className="text-red-500 fill-red-500/20 shrink-0 animate-bounce"
                  />
                  <span>{location}</span>
                </div>
              </div>
            </div>

            {/* Academic badge highlight with hover lift */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-default"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--heading-color)",
              }}
            >
              <GraduationCap size={16} style={{ color: "var(--primary)" }} />
              <span>
                Licence en Conception des Systèmes d’Information — EPF Africa, Dakar
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: 2x2 Qualities Grid + Languages Box */}
          <div className="lg:col-span-6 space-y-4 lg:pt-8">
            {/* 2x2 Grid of Strengths with Staggered Entrance */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: shouldReduceMotion ? 0 : 0.1,
                  },
                },
                hidden: {},
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {defaultQualities.map((q, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: "easeOut" },
                    },
                  }}
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: -6,
                          scale: 1.02,
                          transition: { duration: 0.2 },
                        }
                  }
                  className="p-5 rounded-2xl shadow-xs transition-shadow duration-300 hover:shadow-lg flex items-start gap-3.5 group cursor-default"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 350, damping: 15 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      backgroundColor: "var(--bg-subtle)",
                      color: "var(--primary)",
                    }}
                  >
                    <CheckCircle2 size={18} />
                  </motion.div>
                  <div>
                    <h3
                      className="text-sm font-bold font-serif-custom mb-1 group-hover:text-[var(--primary)] transition-colors"
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
                </motion.div>
              ))}
            </motion.div>

            {/* Languages Card with subtle hover */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={shouldReduceMotion ? {} : { x: 4 }}
              className="p-5 sm:p-6 rounded-2xl shadow-xs transition-shadow duration-300 hover:shadow-md flex items-center gap-3"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: "var(--primary)" }}
              />
              <p
                className="text-sm font-medium"
                style={{ color: "var(--heading-color)" }}
              >
                <strong className="font-semibold">Langues :</strong>{" "}
                <span style={{ color: "var(--body-text)" }}>{languages}</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
