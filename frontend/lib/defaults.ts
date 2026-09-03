import type { SiteSettings, Project } from "@/types";

export const DEFAULT_SETTINGS: SiteSettings = {
  site_title: "Yessaïn Nanadoumadji — Développeur Full-Stack",
  site_description:
    "Portfolio professionnel de Yessaïn Nanadoumadji, développeur full-stack. Découvrez mes projets, compétences et parcours.",
  hero_title: "Développeur Full-Stack",
  hero_subtitle: "Licence 3 en Conception des Systèmes d’Information — EPF Africa, Dakar",
  bio: "Jeune diplômé en Conception des Systèmes d’Information à EPF Africa, Dakar. Je conçois des applications web modernes, du back-end robuste aux interfaces soignées — avec le souci du code propre, maintenable et utile.",
  career_goal:
    "Recherche un stage ou une alternance en développement full-stack pour mettre en pratique mes compétences et contribuer à des projets innovants.",
  email: "nanadoumadjiyessain@gmail.com",
  phone: "+221 77 000 00 00",
  location: "Dakar, Sénégal",
  social_links: {
    github: "https://github.com/YessainDev",
    linkedin: "https://linkedin.com/in/yessain",
  },
  profile_photo: "/images/profil.png",
  about_photo: "/images/about.png",
  about_title: "Un profil full stack dans le concret.",
  about_text:
    "Jeune diplômé en Conception des Systèmes d’Information à l'EPF Africa de Dakar, je conçois et développe des interfaces React dynamiques, des API REST performantes et des architectures robustes connectées à des bases de données relationnelles.",
  about_languages: "Français (courant), Anglais technique",
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    titre: "Portfolio Professionnel",
    description:
      "Site web personnel full-stack avec espace d'administration, API REST, authentification JWT et gestion de contenu dynamique.",
    technologies: ["Next.js", "TypeScript", "Node.js", "Express", "MySQL", "Tailwind CSS"],
    categorie: "Full-Stack",
    lien_demo: "#",
    lien_github: "https://github.com/YessainDev/portfolio",
    image: "/images/projects/1788370893095-283250163.jpeg",
    date_realisation: "2026-08-01",
    mis_en_avant: true,
    archive: false,
  },
  {
    id: 2,
    titre: "Application E-Commerce",
    description:
      "Plateforme e-commerce avec panier, paiement simulé, gestion des produits et tableau de bord administrateur.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    categorie: "Full-Stack",
    lien_demo: "#",
    lien_github: "https://github.com/YessainDev/ecommerce",
    image: "/images/commerce1.png",
    date_realisation: "2025-12-15",
    mis_en_avant: true,
    archive: false,
  },
  {
    id: 3,
    titre: "API REST Task Manager",
    description:
      "API RESTful pour la gestion de tâches avec authentification, validation et documentation Swagger.",
    technologies: ["Node.js", "Express", "PostgreSQL", "JWT"],
    categorie: "Backend",
    lien_demo: "#",
    lien_github: "https://github.com/YessainDev/task-api",
    image: "/images/projects/1785771965307-871920305.jpeg",
    date_realisation: "2025-06-20",
    mis_en_avant: false,
    archive: false,
  },
];
