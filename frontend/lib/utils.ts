export function formatDate(date?: string | null) {
  if (!date) return "Présent";
  return new Date(date).toLocaleDateString("fr-FR", {
    month: "short",
    year: "numeric",
  });
}

export function formatFullDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const skillCategories: Record<string, string> = {
  langages: "Langages",
  frameworks: "Frameworks & Librairies",
  outils: "Outils & Bases de données",
  soft_skills: "Soft Skills",
};

export const categoryColors: Record<string, string> = {
  langages: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  frameworks: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  outils: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  soft_skills: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export function parseTechnologies(techs: unknown): string[] {
  if (Array.isArray(techs)) return techs;
  if (typeof techs === "string") {
    try {
      const parsed = JSON.parse(techs);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return techs.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }
  return [];
}
