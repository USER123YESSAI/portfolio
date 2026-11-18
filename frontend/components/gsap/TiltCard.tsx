"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";

interface TiltCardProps {
  children: ReactNode;
  maxTilt?: number; // angle maximum d'inclinaison (degrés)
  className?: string;
  enableGlare?: boolean;
}

export default function TiltCard({
  children,
  maxTilt = 10,
  className = "",
  enableGlare = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const glare = glareRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * maxTilt;
      const rotateX = -((y - centerY) / centerY) * maxTilt;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 1000,
        transformOrigin: "center center",
        scale: 1.02,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (glare) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        gsap.to(glare, {
          opacity: 0.18,
          background: `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.7) 0%, transparent 70%)`,
          duration: 0.2,
          overwrite: "auto",
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        overwrite: "auto",
      });

      if (glare) {
        gsap.to(glare, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf(card);
      if (glare) gsap.killTweensOf(glare);
    };
  }, [maxTilt]);

  return (
    <div
      ref={cardRef}
      className={`relative will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      {enableGlare && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0 transition-opacity"
        />
      )}
    </div>
  );
}
