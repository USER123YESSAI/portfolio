"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Scan,
  Maximize,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAssetUrl } from "@/lib/api";

interface ProjectGalleryProps {
  images: string[];
  titre: string;
}

export default function ProjectGallery({ images, titre }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const total = images?.length || 0;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  // Gestion des touches du clavier pour la navigation et fermeture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (total > 1) {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, total]);

  if (!images || total === 0) return null;

  const currentImage = getAssetUrl(images[activeIndex]) || images[activeIndex];

  return (
    <div className="mb-8 space-y-4 select-none">
      {/* Cadre principal de la galerie */}
      <div
        className="relative rounded-2xl overflow-hidden h-80 sm:h-[500px] lg:h-[560px] shadow-xl group border transition-all"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--card)",
        }}
      >
        {/* Arrière-plan flouté dynamique pour créer une ambiance harmonieuse sans bandes vides */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src={currentImage}
            alt=""
            fill
            className="object-cover blur-3xl opacity-35 scale-125 saturate-150 transition-all duration-700"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/20 dark:bg-black/50" />
        </div>

        {/* Image principale au premier plan */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeIndex}-${fitMode}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => setIsLightboxOpen(true)}
            className="relative w-full h-full cursor-zoom-in flex items-center justify-center p-2 sm:p-4"
          >
            <Image
              src={currentImage}
              alt={`${titre} - Image ${activeIndex + 1}`}
              fill
              className={`transition-all duration-300 drop-shadow-md ${
                fitMode === "contain"
                  ? "object-contain p-1 sm:p-2"
                  : "object-cover object-top"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1000px"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Barre d'outils supérieure (Mode d'affichage + Plein écran) */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          {/* Bouton pour basculer Ajuster (entier) / Remplir */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFitMode((prev) => (prev === "contain" ? "cover" : "contain"));
            }}
            title={
              fitMode === "contain"
                ? "Passer en mode Remplir (recadré)"
                : "Passer en mode Ajuster (image entière sans coupure)"
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white text-xs font-medium backdrop-blur-md transition-all shadow-md cursor-pointer border border-white/10"
          >
            {fitMode === "contain" ? (
              <>
                <Maximize size={13} />
                <span className="hidden sm:inline">Vue entière</span>
              </>
            ) : (
              <>
                <Scan size={13} />
                <span className="hidden sm:inline">Remplir</span>
              </>
            )}
          </button>

          {/* Bouton Plein Écran / Lightbox */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            title="Agrandir en plein écran"
            className="p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition-all shadow-md cursor-pointer border border-white/10"
          >
            <Maximize2 size={15} />
          </button>
        </div>

        {/* Flèches de navigation gauche / droite (si plusieurs images) */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110 cursor-pointer z-20 border border-white/10"
              aria-label="Image précédente"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110 cursor-pointer z-20 border border-white/10"
              aria-label="Image suivante"
            >
              <ChevronRight size={22} />
            </button>

            {/* Compteur d'images */}
            <div className="absolute bottom-3 right-3 px-3.5 py-1 bg-black/65 backdrop-blur-md rounded-full text-white text-xs font-mono font-semibold shadow-md border border-white/10 z-20">
              {activeIndex + 1} / {total}
            </div>
          </>
        )}
      </div>

      {/* Miniatures cliquables (si plusieurs images) */}
      {total > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {images.map((img, idx) => {
            const url = getAssetUrl(img) || img;
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-14 sm:w-28 sm:h-18 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "ring-2 ring-[#0ea5e9] scale-105 shadow-md opacity-100"
                    : "opacity-60 hover:opacity-100 border border-transparent hover:scale-102"
                }`}
                style={{
                  border: isActive ? "none" : "1px solid var(--border)",
                  backgroundColor: "var(--card)",
                }}
              >
                <Image
                  src={url}
                  alt={`${titre} miniature ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox / Vue Plein Écran immersive */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-6"
          >
            {/* Header du Lightbox */}
            <div className="flex items-center justify-between text-white z-30">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold truncate max-w-xs sm:max-w-md">
                  {titre}
                </span>
                {total > 1 && (
                  <span className="px-2.5 py-0.5 bg-white/10 rounded-full text-xs font-mono">
                    {activeIndex + 1} / {total}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Fermer (Échap)"
              >
                <X size={22} />
              </button>
            </div>

            {/* Zone centrale de l'image agrandie */}
            <div
              className="relative flex-1 w-full flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full max-w-6xl max-h-[85vh]">
                <Image
                  src={currentImage}
                  alt={`${titre} - Image ${activeIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Flèches Lightbox */}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all cursor-pointer backdrop-blur-md"
                    title="Précédent"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all cursor-pointer backdrop-blur-md"
                    title="Suivant"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
            </div>

            {/* Footer Lightbox avec miniatures */}
            {total > 1 && (
              <div
                className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-30"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, idx) => {
                  const url = getAssetUrl(img) || img;
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`relative w-16 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer ${
                        isActive
                          ? "ring-2 ring-[#0ea5e9] scale-105 opacity-100"
                          : "opacity-40 hover:opacity-90"
                      }`}
                    >
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
