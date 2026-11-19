"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAssetUrl } from "@/lib/api";

interface ProjectGalleryProps {
  images: string[];
  titre: string;
}

export default function ProjectGallery({ images, titre }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const currentImage = getAssetUrl(images[activeIndex]) || images[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Grande image principale */}
      <div
        className="relative rounded-2xl overflow-hidden h-72 sm:h-[460px] shadow-lg group"
        style={{
          border: "1px solid var(--border)",
          backgroundColor: "var(--card)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={currentImage}
              alt={`${titre} - Image ${activeIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 896px"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Flèches de navigation (si plusieurs images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer z-10"
              aria-label="Image précédente"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer z-10"
              aria-label="Image suivante"
            >
              <ChevronRight size={22} />
            </button>
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-mono font-medium z-10">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Miniatures cliquables (si plusieurs images) */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => {
            const url = getAssetUrl(img) || img;
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "ring-2 ring-[#0ea5e9] scale-105 shadow-md"
                    : "opacity-60 hover:opacity-100 border border-transparent"
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
    </div>
  );
}
