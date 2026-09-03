export interface User {
  id: number;
  nom: string;
  email: string;
  role: string;
}

export interface Project {
  id: number;
  titre: string;
  description: string;
  technologies: string[];
  categorie?: string;
  image?: string;
  lien_demo?: string;
  lien_github?: string;
  date_realisation?: string;
  mis_en_avant: boolean;
  archive: boolean;
}

export interface Skill {
  id: number;
  nom: string;
  categorie: "langages" | "frameworks" | "outils" | "soft_skills";
  niveau: number;
  icone?: string;
}

export interface Experience {
  id: number;
  poste: string;
  entreprise: string;
  date_debut: string;
  date_fin?: string | null;
  description?: string;
}

export interface Education {
  id: number;
  intitule: string;
  etablissement: string;
  date_debut: string;
  date_fin?: string | null;
  description?: string;
}

export interface Certification {
  id: number;
  nom: string;
  organisme: string;
  date_obtention: string;
  lien_justificatif?: string;
}

export interface Message {
  id: number;
  nom: string;
  email: string;
  sujet: string;
  contenu: string;
  date_envoi: string;
  statut_lu: boolean;
}

export interface SiteSettings {
  site_title?: string;
  site_description?: string;
  hero_title?: string;
  hero_subtitle?: string;
  bio?: string;
  career_goal?: string;
  email?: string;
  phone?: string;
  location?: string;
  social_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  profile_photo?: string;
  cv_path?: string;
  cv_password?: string;
  about_title?: string;
  about_text?: string;
  about_photo?: string;
  about_languages?: string;
}

export interface DashboardStats {
  projects: number;
  skills: number;
  experiences: number;
  educations: number;
  certifications: number;
  messages: number;
  unreadMessages: number;
}

export interface ContactForm {
  nom: string;
  email: string;
  sujet: string;
  contenu: string;
}
