"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CVPasswordModal from "@/components/ui/CVPasswordModal";
import Magnetic from "@/components/gsap/Magnetic";

const navLinks = [
  { href: "/#accueil", label: "Accueil", id: "accueil" },
  { href: "/#a-propos", label: "À propos", id: "a-propos" },
  { href: "/#competences", label: "Compétences", id: "competences" },
  { href: "/projects", label: "Projets" },
  { href: "/journey", label: "Parcours" },
  { href: "/contact", label: "Contact" },
];

interface HeaderProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export default function Header({
  mobileOpen,
  setMobileOpen,
  theme,
  toggleTheme,
}: HeaderProps) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("accueil");
  const [cvModalOpen, setCvModalOpen] = useState(false);

  const isLight = theme === "light";

  // Détection dynamique de la section active lors du défilement sur la page d'accueil
  useEffect(() => {
    if (pathname !== "/") return;

    if (window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (["accueil", "a-propos", "competences"].includes(hash)) {
        setActiveSection(hash);
      }
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // Décalage avec le header sticky

      const sections = ["accueil", "a-propos", "competences"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id?: string
  ) => {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = id || href.replace("/#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${targetId}`);
        setActiveSection(targetId);
      }
      setMobileOpen(false);
    }
  };

  const isLinkActive = (href: string, id?: string) => {
    if (pathname === "/") {
      if (id) {
        return activeSection === id;
      }
      return false;
    }
    return pathname === href;
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full backdrop-blur-md transition-colors duration-300"
      style={{
        backgroundColor: "var(--nav-bg)",
        borderBottom: "1px solid var(--nav-border)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-12">
        {/* Logo avec micro-interaction */}
        <Magnetic strength={0.2}>
          <Link
            href="/#accueil"
            onClick={(e) => handleNavClick(e, "/#accueil", "accueil")}
            className="group flex items-center text-2xl font-extrabold tracking-tight font-serif-custom transition-colors duration-300"
            style={{ color: "var(--heading-color)" }}
          >
            <span>YN</span>
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: "var(--logo-dot)" }}
            >
              .
            </motion.span>
          </Link>
        </Magnetic>

        {/* Desktop Nav Links avec indicateur de glissement moderne */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href, link.id);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.id)}
                className="relative px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 rounded-full"
                style={{
                  color: active ? "var(--nav-text-active)" : "var(--nav-text)",
                  fontWeight: active ? "600" : undefined,
                }}
              >
                {/* Active Sliding Background Pill */}
                {active && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-full -z-10 shadow-xs"
                    style={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: CV button + Theme toggle + Mobile menu */}
        <div className="flex items-center gap-3">
          {/* CV Button avec micro-interaction hover/tap + GSAP Magnetic */}
          <Magnetic strength={0.25} className="hidden sm:inline-block">
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCvModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-shadow shadow-xs hover:shadow-md cursor-pointer"
              style={{ backgroundColor: "var(--btn-primary-bg)" }}
            >
              <Download size={15} />
              <span>Télécharger CV</span>
            </motion.button>
          </Magnetic>

          {/* Theme Toggle Button avec rotation fluide */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92, rotate: 180 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-lg border transition-colors shadow-xs cursor-pointer"
            style={{
              backgroundColor: "var(--icon-bg)",
              borderColor: "var(--border)",
              color: isLight ? "#0f172a" : "#f8fafc",
            }}
            aria-label={
              isLight ? "Passer au thème sombre" : "Passer au thème clair"
            }
            title={isLight ? "Thème sombre" : "Thème clair"}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isLight ? <Moon size={18} /> : <Sun size={18} />}
            </motion.div>
          </motion.button>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded transition-colors"
            style={{ color: "var(--nav-text)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden md:hidden px-6 py-5 border-b transition-colors duration-300"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--nav-border)",
            }}
          >
            <motion.nav
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.05 },
                },
                closed: {},
              }}
              className="flex flex-col space-y-3"
            >
              {navLinks.map((link) => {
                const active = isLinkActive(link.href, link.id);
                return (
                  <motion.div
                    key={link.href}
                    variants={{
                      open: { opacity: 1, x: 0 },
                      closed: { opacity: 0, x: -10 },
                    }}
                  >
                    <Link
                      href={link.href}
                      className="text-base font-medium py-1 transition-colors flex items-center justify-between"
                      style={{
                        color: active
                          ? "var(--nav-text-active)"
                          : "var(--nav-text)",
                        fontWeight: active ? "600" : undefined,
                      }}
                      onClick={(e) => {
                        handleNavClick(e, link.href, link.id);
                        setMobileOpen(false);
                      }}
                    >
                      <span>{link.label}</span>
                      {active && (
                        <motion.span
                          layoutId="activeMobileDot"
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: "var(--primary)" }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 10 },
                }}
                className="pt-3"
                style={{ borderTop: "1px solid var(--nav-border)" }}
              >
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setCvModalOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg shadow-sm cursor-pointer"
                  style={{ backgroundColor: "var(--btn-primary-bg)" }}
                >
                  <Download size={15} />
                  <span>Télécharger CV</span>
                </button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CV Password Protection Modal */}
      <CVPasswordModal
        isOpen={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
      />
    </motion.header>
  );
}
