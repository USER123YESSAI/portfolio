"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";

export default function Hero3DIcosahedron() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 320;
    const height = mount.clientHeight || 320;

    // --- Scène & Caméra ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const isDark = theme === "dark";
    const primaryColor = isDark ? 0x38bdf8 : 0x0ea5e9;
    const accentColor = isDark ? 0xf59e0b : 0xd97706;

    // --- Groupe principal 3D ---
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Icosaèdre Wireframe externe
    const outerGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.35 : 0.22,
      roughness: 0.2,
      metalness: 0.8,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    mainGroup.add(outerMesh);

    // 2. Noyau géométrique interne à facettes légères
    const innerGeo = new THREE.OctahedronGeometry(0.8, 0);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: accentColor,
      transparent: true,
      opacity: isDark ? 0.45 : 0.28,
      roughness: 0.1,
      metalness: 0.6,
      transmission: 0.6,
      ior: 1.5,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 3. Anneaux orbitaux tournants
    const torusGeo = new THREE.TorusGeometry(1.85, 0.02, 16, 80);
    const torusMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: isDark ? 0.5 : 0.3,
    });
    const torus1 = new THREE.Mesh(torusGeo, torusMat);
    torus1.rotation.x = Math.PI / 3;
    mainGroup.add(torus1);

    const torus2 = new THREE.Mesh(torusGeo, torusMat);
    torus2.rotation.y = Math.PI / 4;
    torus2.rotation.z = Math.PI / 6;
    mainGroup.add(torus2);

    // 4. Particules satellites autour de la structure
    const satelliteCount = 28;
    const satGeo = new THREE.BufferGeometry();
    const satPositions = new Float32Array(satelliteCount * 3);
    for (let i = 0; i < satelliteCount; i++) {
      const radius = 1.9 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      satPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      satPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      satPositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    satGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(satPositions, 3)
    );
    const satMat = new THREE.PointsMaterial({
      color: accentColor,
      size: 0.06,
      transparent: true,
      opacity: isDark ? 0.9 : 0.6,
    });
    const satellites = new THREE.Points(satGeo, satMat);
    mainGroup.add(satellites);

    // --- Éclairage ---
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.2 : 1.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(primaryColor, isDark ? 3.5 : 2.5, 10);
    pointLight.position.set(2, 3, 3);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(accentColor, isDark ? 2.5 : 1.8, 10);
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);

    // --- Interaction souris avec inertie douce ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      mouseX = x;
      mouseY = y;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    // --- Animation loop ---
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Rotation automatique fluide
      outerMesh.rotation.y += 0.3 * delta;
      outerMesh.rotation.x += 0.2 * delta;

      innerMesh.rotation.y -= 0.5 * delta;
      innerMesh.rotation.z += 0.3 * delta;

      torus1.rotation.z += 0.4 * delta;
      torus2.rotation.x += 0.3 * delta;
      satellites.rotation.y += 0.25 * delta;

      // Respiration subtile
      const scale = 1 + Math.sin(elapsed * 1.5) * 0.03;
      mainGroup.scale.set(scale, scale, scale);

      // Inertie souris
      targetRotationY += (mouseX * 0.6 - targetRotationY) * 0.05;
      targetRotationX += (mouseY * 0.6 - targetRotationX) * 0.05;
      mainGroup.rotation.y = targetRotationY;
      mainGroup.rotation.x = targetRotationX;

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize ---
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);

      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      satGeo.dispose();
      satMat.dispose();
      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full pointer-events-none select-none flex items-center justify-center"
      aria-hidden="true"
    />
  );
}
