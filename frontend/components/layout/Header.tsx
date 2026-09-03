"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun } from "lucide-react";
import CVPasswordModal from "@/components/ui/CVPasswordModal";

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
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md transition-colors duration-300"
      style={{
        backgroundColor: "var(--nav-bg)",
        borderBottom: "1px solid var(--nav-border)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-12">
        {/* Logo */}
        <Link
          href="/#accueil"
          onClick={(e) => handleNavClick(e, "/#accueil", "accueil")}
          className="flex items-center text-2xl font-extrabold tracking-tight font-serif-custom transition-colors duration-300"
          style={{ color: "var(--heading-color)" }}
        >
          YN<span style={{ color: "var(--logo-dot)" }}>.</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href, link.id);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.id)}
                className="text-sm font-medium transition-colors duration-200 py-1"
                style={{
                  color: active ? "var(--nav-text-active)" : "var(--nav-text)",
                  fontWeight: active ? "600" : undefined,
                  borderBottom: active
                    ? "2px solid var(--primary)"
                    : "2px solid transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: CV button + Theme toggle + Mobile menu */}
        <div className="flex items-center gap-3">
          {/* CV Button */}
          <button
            onClick={() => setCvModalOpen(true)}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded transition-all shadow-sm cursor-pointer"
            style={{ backgroundColor: "var(--btn-primary-bg)" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--btn-primary-hover)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--btn-primary-bg)")
            }
          >
            Télécharger CV
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg border transition-all duration-300"
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
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded transition-colors"
            style={{ color: "var(--nav-text)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 py-5 space-y-3 border-b transition-colors duration-300"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--nav-border)",
          }}
        >
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href, link.id);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium py-1 transition-colors flex items-center justify-between"
                  style={{
                    color: active ? "var(--nav-text-active)" : "var(--nav-text)",
                    fontWeight: active ? "600" : undefined,
                  }}
                  onClick={(e) => {
                    handleNavClick(e, link.href, link.id);
                    setMobileOpen(false);
                  }}
                >
                  <span>{link.label}</span>
                  {active && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "var(--primary)" }}
                    />
                  )}
                </Link>
              );
            })}
            <div
              className="pt-3"
              style={{ borderTop: "1px solid var(--nav-border)" }}
            >
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setCvModalOpen(true);
                }}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white rounded shadow-sm cursor-pointer"
                style={{ backgroundColor: "var(--btn-primary-bg)" }}
              >
                Télécharger CV
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* CV Password Protection Modal */}
      <CVPasswordModal
        isOpen={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
      />
    </header>
  );
}
