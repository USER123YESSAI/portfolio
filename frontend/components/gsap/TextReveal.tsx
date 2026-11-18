"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "span" | "div";
}

export default function TextReveal({
  children,
  className = "",
  delay = 0,
  as: Component = "span",
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const words = el.querySelectorAll(".word-reveal");

    gsap.fromTo(
      words,
      {
        opacity: 0,
        y: 20,
        filter: "blur(4px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.08,
        delay,
        ease: "power3.out",
      }
    );
  }, [delay, children]);

  const words = children.split(" ");

  return (
    <Component ref={containerRef as any} className={`inline-block ${className}`}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden mr-[0.28em]">
          <span className="word-reveal inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
}
