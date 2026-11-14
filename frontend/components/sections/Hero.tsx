"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Github, Linkedin } from "@/components/ui/SocialIcons";
import { getAssetUrl } from "@/lib/api";
import type { SiteSettings } from "@/types";

interface HeroProps {
  settings: SiteSettings;
}

export default function Hero({ settings }: HeroProps) {
  const photoUrl =
    getAssetUrl(settings.profile_photo ?? undefined) || "/images/profil.png";
  const [imgSrc, setImgSrc] = useState(photoUrl);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setImgSrc(photoUrl);
  }, [photoUrl]);

  const githubUrl =
    settings.social_links?.github || "https://github.com/YessainDev";
  const linkedinUrl =
    settings.social_links?.linkedin || "https://linkedin.com/in/yessain";
  const emailAddress = settings.email || "nanadoumadjiyessain@gmail.com";

  // Stagger container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" as const },
    },
  };

  return (
    <section id="accueil" className="relative pt-12 sm:pt-16 pb-0 scroll-mt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center pb-16">
          {/* Left Column: Typography, Bio & Buttons with Stagger */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6"
          >
            {/* Availability Badge with live breathing indicator */}
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <span
                className="w-8 h-[1px]"
                style={{ backgroundColor: "var(--label-color)" }}
              />
              <span
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--label-color)" }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: "var(--label-color)" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ backgroundColor: "var(--label-color)" }}
                  />
                </span>
                DISPONIBLE POUR STAGE / ALTERNANCE
              </span>
            </motion.div>

            {/* Serif Name Heading with reveal */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold font-serif-custom tracking-tight leading-[1.05]"
              style={{ color: "var(--heading-color)" }}
            >
              Yessaïn <br />
              <span className="gradient-text">Nanadoumadji</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              variants={itemVariants}
              className="text-xl sm:text-2xl font-serif-custom italic"
              style={{ color: "var(--accent-text)" }}
            >
              {settings.hero_title || "Développeur Full-Stack"}
            </motion.h2>

            {/* Bio text */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg leading-relaxed max-w-xl"
              style={{ color: "var(--body-text)" }}
            >
              {settings.bio ||
                "Jeune diplômé en Conception des Systèmes d’Information à l'ISI, Dakar. Je conçois des applications web modernes, du back-end robuste aux interfaces soignées — avec le souci du code propre, maintenable et utile."}
            </motion.p>

            {/* Action Buttons with Micro-interactions */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold text-sm rounded-lg shadow-sm transition-all hover:shadow-lg group cursor-pointer"
                  style={{ backgroundColor: "var(--btn-primary-bg)" }}
                >
                  <span>Voir mes projets</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1.5 transition-transform duration-300"
                  />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent font-semibold text-sm rounded-lg transition-all hover:bg-white/10 cursor-pointer"
                  style={{
                    color: "var(--btn-secondary-text)",
                    border: "1px solid var(--btn-secondary-border)",
                  }}
                >
                  <Mail size={16} />
                  <span>Me contacter</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Social Links Row with lift effects */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 pt-2 text-sm font-medium"
              style={{ color: "var(--body-text)" }}
            >
              <motion.a
                whileHover={{ y: -3, scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-[var(--primary)]"
              >
                <Github size={17} />
                <span>GitHub</span>
              </motion.a>
              <motion.a
                whileHover={{ y: -3, scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-[var(--primary)]"
              >
                <Linkedin size={17} />
                <span>LinkedIn</span>
              </motion.a>
              <motion.a
                whileHover={{ y: -3, scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                href={`mailto:${emailAddress}`}
                className="flex items-center gap-1.5 transition-colors hover:text-[var(--primary)]"
              >
                <Mail size={17} />
                <span>Email</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column: Photo Card with floating motion effect */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              className="relative w-72 h-80 sm:w-80 sm:h-96"
            >
              {/* Subtle background frame offset with gentle organic float */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        rotate: [-2, -4, -2],
                        scale: [1, 1.02, 1],
                      }
                }
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-3xl -rotate-2 transform shadow-md"
                style={{ backgroundColor: "var(--card)" }}
              />

              {/* Photo Image Card with gentle hover perspective */}
              <motion.div
                whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl"
                style={{ border: "1px solid var(--border)" }}
              >
                <Image
                  src={imgSrc}
                  alt="Yessaïn Nanadoumadji"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 288px, 320px"
                  priority
                  onError={() => setImgSrc("/images/profil.png")}
                />
              </motion.div>

              {/* Floating Bottom-Left Location Card with gentle periodic float */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [0, -6, 0],
                      }
                }
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-5 left-4 px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 z-10 backdrop-blur-sm"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="text-red-500">
                  <MapPin size={18} className="fill-red-500 text-white animate-pulse" />
                </div>
                <div>
                  <div
                    className="text-xs font-bold"
                    style={{ color: "var(--heading-color)" }}
                  >
                    {settings.location || "Dakar, Sénégal"}
                  </div>
                  <div
                    className="text-[11px]"
                    style={{ color: "var(--body-text)" }}
                  >
                    ISI
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom 4-Column Stats Strip with Staggered Entrance & Hover Lift */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full border-t border-b mt-8"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--card)",
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4">
          <motion.div
            whileHover={{ y: -3, backgroundColor: "var(--bg-subtle)" }}
            transition={{ duration: 0.2 }}
            className="py-6 px-4 text-center border-r transition-colors"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="text-2xl sm:text-3xl font-bold font-serif-custom"
              style={{ color: "var(--heading-color)" }}
            >
              2+
            </div>
            <div
              className="text-xs sm:text-sm mt-0.5"
              style={{ color: "var(--body-text)" }}
            >
              Années de code
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3, backgroundColor: "var(--bg-subtle)" }}
            transition={{ duration: 0.2 }}
            className="py-6 px-4 text-center border-r transition-colors"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="text-2xl sm:text-3xl font-bold font-serif-custom"
              style={{ color: "var(--heading-color)" }}
            >
              8+
            </div>
            <div
              className="text-xs sm:text-sm mt-0.5"
              style={{ color: "var(--body-text)" }}
            >
              Projets réalisés
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3, backgroundColor: "var(--bg-subtle)" }}
            transition={{ duration: 0.2 }}
            className="py-6 px-4 text-center border-r transition-colors"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="text-2xl sm:text-3xl font-bold font-serif-custom"
              style={{ color: "var(--heading-color)" }}
            >
              9+
            </div>
            <div
              className="text-xs sm:text-sm mt-0.5"
              style={{ color: "var(--body-text)" }}
            >
              Technologies
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3, backgroundColor: "var(--bg-subtle)" }}
            transition={{ duration: 0.2 }}
            className="py-6 px-4 text-center transition-colors"
          >
            <div
              className="text-2xl sm:text-3xl font-bold font-serif-custom"
              style={{ color: "var(--primary)" }}
            >
              2026
            </div>
            <div
              className="text-xs sm:text-sm mt-0.5"
              style={{ color: "var(--body-text)" }}
            >
              Diplôme CSI
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
