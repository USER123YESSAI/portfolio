"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  mounted: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Récupérer le thème depuis l'attribut déjà posé par le script inline ou le localStorage
    const attr = document.documentElement.getAttribute("data-theme") as Theme | null;
    const saved = (localStorage.getItem("portfolio-theme") as Theme | null) || attr;
    const initialTheme = saved === "dark" ? "dark" : "light";
    
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    document.body.setAttribute("data-theme", initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      // Ignorer si localStorage désactivé
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nextTheme);
      document.body.setAttribute("data-theme", nextTheme);
      try {
        localStorage.setItem("portfolio-theme", nextTheme);
      } catch {
        // Ignorer
      }
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
