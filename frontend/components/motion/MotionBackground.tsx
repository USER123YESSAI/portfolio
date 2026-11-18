"use client";

import { motion, useReducedMotion } from "framer-motion";
import InteractiveBackground3D from "@/components/three/InteractiveBackground3D";

export default function MotionBackground() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <>
      {/* Three.js Interactive Particle & Constellation Canvas */}
      <InteractiveBackground3D />

      <div
        aria-hidden="true"
        className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none"
      >
      {/* Radiant Floating Orb 1 (Top Left) */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 sm:w-[520px] sm:h-[520px] rounded-full blur-3xl opacity-35 dark:opacity-25"
        style={{
          background:
            "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, 50, 20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Radiant Floating Orb 2 (Top Right / Center) */}
      <motion.div
        className="absolute top-1/4 -right-36 w-80 h-80 sm:w-[460px] sm:h-[460px] rounded-full blur-3xl opacity-30 dark:opacity-20"
        style={{
          background:
            "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -50, 20, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.12, 0.96, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Radiant Floating Orb 3 (Bottom Center) */}
      <motion.div
        className="absolute -bottom-40 left-1/3 w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full blur-3xl opacity-25 dark:opacity-15"
        style={{
          background:
            "radial-gradient(circle, var(--badge-primary) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -30, 10, 0],
          scale: [0.95, 1.05, 1, 0.95],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Subtle Floating Organic Element 1 (Top Left) */}
      <motion.div
        className="absolute top-36 left-[8%] w-10 h-10 border border-sky-400/20 dark:border-sky-400/15 rounded-2xl hidden lg:block"
        animate={{
          y: [0, -18, 0],
          rotate: [0, 45, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle Floating Organic Element 2 (Right Center) */}
      <motion.div
        className="absolute top-[45%] right-[10%] w-6 h-6 rounded-full border border-amber-400/25 dark:border-amber-400/15 hidden lg:block"
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.55, 0.25],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Subtle Floating Cross/Plus 3 (Bottom Left) */}
      <motion.div
        className="absolute bottom-48 left-[12%] text-xs font-mono text-sky-400/30 dark:text-sky-400/20 hidden lg:block"
        animate={{
          y: [0, -14, 0],
          rotate: [0, 90, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      >
        ✦
      </motion.div>
    </div>
    </>
  );
}
