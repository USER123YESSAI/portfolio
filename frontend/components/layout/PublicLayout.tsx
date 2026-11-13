"use client";

import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MotionBackground from "@/components/motion/MotionBackground";
import { useTheme } from "@/contexts/ThemeContext";
import type { SiteSettings } from "@/types";

interface PublicLayoutProps {
  children: React.ReactNode;
  settings?: SiteSettings;
}

export default function PublicLayout({ children, settings }: PublicLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <MotionBackground />
      <Header
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="pt-20 min-h-screen relative">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
