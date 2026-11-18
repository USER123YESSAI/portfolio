"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";

export default function InteractiveBackground3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Respecter la préférence de réduction de mouvement
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const container = containerRef.current;
    if (!container) return;

    // --- Scène & Caméra ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 220;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Constellation de particules ---
    const isDark = theme === "dark";
    const particleCount = window.innerWidth < 768 ? 90 : 160;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    const primaryColor = new THREE.Color(isDark ? 0x38bdf8 : 0x0284c7);
    const accentColor = new THREE.Color(isDark ? 0xf59e0b : 0xd97706);

    for (let i = 0; i < particleCount; i++) {
      // Distribution dans un cube spacieux
      positions[i * 3] = (Math.random() - 0.5) * 450;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 450;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 250;

      // Vélocités légères
      velocities.push({
        x: (Math.random() - 0.5) * 0.18,
        y: (Math.random() - 0.5) * 0.18,
        z: (Math.random() - 0.5) * 0.12,
      });

      // Alternance de teintes (Cyan & Ambre)
      const color = Math.random() > 0.3 ? primaryColor : accentColor;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Création de texture de particule douce et ronde
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0.7)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const pointsMaterial = new THREE.PointsMaterial({
      size: isDark ? 4.5 : 3.8,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: isDark ? 0.75 : 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, pointsMaterial);
    scene.add(particles);

    // --- Lignes de connexion dynamiques (Mesh de lignes) ---
    const lineMaterial = new THREE.LineBasicMaterial({
      color: isDark ? 0x0ea5e9 : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.12 : 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const maxConnections = particleCount * 6;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- Anneau orbital 3D discret en arrière-plan ---
    const ringGeometry = new THREE.TorusGeometry(85, 0.4, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x0ea5e9 : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.15 : 0.08,
      wireframe: true,
    });
    const orbitalRing = new THREE.Mesh(ringGeometry, ringMaterial);
    orbitalRing.position.set(70, -30, -50);
    orbitalRing.rotation.x = Math.PI / 3;
    scene.add(orbitalRing);

    // --- Gestion interactive de la souris & Parallaxe ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });

    // --- Redimensionnement dynamique ---
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // --- Boucle d'animation avec lerp fluide ---
    let animationFrameId: number;
    let isVisible = true;

    const onVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      // Parallax fluide
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;
      camera.position.x = targetX;
      camera.position.y = -targetY;
      camera.lookAt(scene.position);

      // Rotation de l'anneau orbital
      orbitalRing.rotation.z += 0.002;
      orbitalRing.rotation.y += 0.001;

      // Mise à jour de la position des particules
      const pos = geometry.attributes.position.array as Float32Array;
      let lineVertexIndex = 0;
      const connectionDist = 65;

      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        // Rebond doux sur les frontières
        if (pos[i * 3] > 220 || pos[i * 3] < -220) velocities[i].x *= -1;
        if (pos[i * 3 + 1] > 220 || pos[i * 3 + 1] < -220) velocities[i].y *= -1;
        if (pos[i * 3 + 2] > 120 || pos[i * 3 + 2] < -120) velocities[i].z *= -1;

        // Connexions entre particules proches
        for (let j = i + 1; j < particleCount; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectionDist && lineVertexIndex < maxConnections * 6 - 6) {
            linePositions[lineVertexIndex++] = pos[i * 3];
            linePositions[lineVertexIndex++] = pos[i * 3 + 1];
            linePositions[lineVertexIndex++] = pos[i * 3 + 2];
            linePositions[lineVertexIndex++] = pos[j * 3];
            linePositions[lineVertexIndex++] = pos[j * 3 + 1];
            linePositions[lineVertexIndex++] = pos[j * 3 + 2];
          }
        }
      }

      geometry.attributes.position.needsUpdate = true;

      // Nettoyer le reste des lignes non utilisées
      for (let i = lineVertexIndex; i < maxConnections * 6; i++) {
        linePositions[i] = 0;
      }
      lineGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup complet ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      geometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 select-none overflow-hidden"
    />
  );
}
