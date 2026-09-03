"use client";

import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
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
      <Header
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="pt-20 min-h-screen">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
