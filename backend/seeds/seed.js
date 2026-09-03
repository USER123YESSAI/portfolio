require("dotenv").config();
const bcrypt = require("bcrypt");
const {
  sequelize,
  User,
  Project,
  Skill,
  Experience,
  Education,
  Certification,
  Setting,
} = require("../models");

const seed = async () => {
  try {
    // Ne JAMAIS forcer l'écrasement (force: true) pour préserver les données de production
    await sequelize.sync();

    // Si des données existent déjà (ex: admin, projets ajoutés), on n'écrase rien !
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log("ℹ️ Des données existent déjà dans la base. Le seed est ignoré pour protéger vos données.");
      process.exit(0);
    }
    console.log("Base de données initialisée pour la première fois.");

    const admin = await User.create({
      nom: "Yessaïn Nanadoumadji",
      email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
      mot_de_passe: await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin123!", 12),
      role: "admin",
    });

    await Setting.bulkCreate([
      {
        cle: "site_title",
        valeur: "Yessaïn Nanadoumadji — Développeur Full-Stack",
      },
      {
        cle: "site_description",
        valeur:
          "Portfolio professionnel de Yessaïn Nanadoumadji, étudiant Bachelor CSI 3 à EPF Africa, développeur full-stack passionné.",
      },
      {
        cle: "hero_title",
        valeur: "Développeur Full-Stack",
      },
      {
        cle: "hero_subtitle",
        valeur: "Étudiant Bachelor CSI 3 — EPF Africa, Dakar",
      },
      {
        cle: "bio",
        valeur:
          "Passionné par le développement web moderne, je conçois des applications performantes, sécurisées et centrées sur l'expérience utilisateur. Mon objectif : créer des solutions digitales qui allient rigueur technique et impact métier.",
      },
      {
        cle: "career_goal",
        valeur:
          "Recherche un stage ou une alternance en développement full-stack pour mettre en pratique mes compétences et contribuer à des projets innovants.",
      },
      {
        cle: "email",
        valeur: "nanadoumadjiyessain@gmail.com",
      },
      {
        cle: "phone",
        valeur: "+221 77 000 00 00",
      },
      {
        cle: "location",
        valeur: "Dakar, Sénégal",
      },
      {
        cle: "social_links",
        valeur: JSON.stringify({
          github: "https://github.com/YessainDev",
          linkedin: "https://linkedin.com/in/yessain",
          twitter: "",
        }),
      },
      {
        cle: "about_title",
        valeur: "Un profil full stack ancré dans le concret.",
      },
      {
        cle: "about_text",
        valeur:
          "Étudiant en 3ème année de Bachelor Concepteur Développeur d'Applications (CSI 3) à l'EPF Africa à Dakar, je conçois des applications web complètes, robustes et orientées résultats. Curieux et autonome, je transforme des exigences complexes en architectures claires.",
      },
      {
        cle: "about_languages",
        valeur: "Français (courant), Anglais technique",
      },
      {
        cle: "cv_password",
        valeur: "2026",
      },
      {
        cle: "profile_photo",
        valeur: "/uploads/profile/1788375080335-890266699.png",
      },
      {
        cle: "about_photo",
        valeur: "/uploads/profile/1788375124479-305324185.png",
      },
      {
        cle: "cv_path",
        valeur: "/uploads/cv/1788330092179-49704196.pdf",
      },
    ]);

    await Skill.bulkCreate([
      { nom: "JavaScript", categorie: "langages", niveau: 90, icone: "javascript", user_id: admin.id },
      { nom: "TypeScript", categorie: "langages", niveau: 85, icone: "typescript", user_id: admin.id },
      { nom: "Python", categorie: "langages", niveau: 75, icone: "python", user_id: admin.id },
      { nom: "Java", categorie: "langages", niveau: 70, icone: "java", user_id: admin.id },
      { nom: "React", categorie: "frameworks", niveau: 88, icone: "react", user_id: admin.id },
      { nom: "Next.js", categorie: "frameworks", niveau: 85, icone: "nextjs", user_id: admin.id },
      { nom: "Node.js", categorie: "frameworks", niveau: 82, icone: "nodejs", user_id: admin.id },
      { nom: "Express.js", categorie: "frameworks", niveau: 80, icone: "express", user_id: admin.id },
      { nom: "Tailwind CSS", categorie: "frameworks", niveau: 88, icone: "tailwind", user_id: admin.id },
      { nom: "MySQL", categorie: "outils", niveau: 78, icone: "mysql", user_id: admin.id },
      { nom: "Git", categorie: "outils", niveau: 85, icone: "git", user_id: admin.id },
      { nom: "Docker", categorie: "outils", niveau: 65, icone: "docker", user_id: admin.id },
      { nom: "Travail d'équipe", categorie: "soft_skills", niveau: 90, icone: "team", user_id: admin.id },
      { nom: "Communication", categorie: "soft_skills", niveau: 85, icone: "communication", user_id: admin.id },
      { nom: "Résolution de problèmes", categorie: "soft_skills", niveau: 92, icone: "problem", user_id: admin.id },
    ]);

    await Project.bulkCreate([
      {
        titre: "Portfolio Professionnel",
        description:
          "Site web personnel full-stack avec espace d'administration, API REST, authentification JWT et gestion de contenu dynamique.",
        technologies: ["Next.js", "TypeScript", "Node.js", "Express", "MySQL", "Tailwind CSS"],
        categorie: "Full-Stack",
        lien_demo: "#",
        lien_github: "https://github.com/YessainDev/portfolio",
        image: "/uploads/projects/1788370893095-283250163.jpeg",
        date_realisation: "2026-08-01",
        mis_en_avant: true,
        user_id: admin.id,
      },
      {
        titre: "Application E-Commerce",
        description:
          "Plateforme e-commerce avec panier, paiement simulé, gestion des produits et tableau de bord administrateur.",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        categorie: "Full-Stack",
        lien_demo: "#",
        lien_github: "https://github.com/YessainDev/ecommerce",
        image: "/uploads/projects/1785771918259-78512873.jpeg",
        date_realisation: "2025-12-15",
        mis_en_avant: true,
        user_id: admin.id,
      },
      {
        titre: "API REST Task Manager",
        description:
          "API RESTful pour la gestion de tâches avec authentification, validation et documentation Swagger.",
        technologies: ["Node.js", "Express", "PostgreSQL", "JWT"],
        categorie: "Backend",
        lien_demo: "#",
        lien_github: "https://github.com/YessainDev/task-api",
        image: "/uploads/projects/1785771965307-871920305.jpeg",
        date_realisation: "2025-06-20",
        mis_en_avant: false,
        user_id: admin.id,
      },
    ]);

    await Experience.bulkCreate([
      {
        poste: "Développeur Freelance",
        entreprise: "Indépendant",
        date_debut: "2024-09-01",
        date_fin: null,
        description:
          "Développement de sites web et applications sur mesure pour des clients locaux. Stack : React, Node.js, WordPress.",
        user_id: admin.id,
      },
      {
        poste: "Stagiaire Développeur Web",
        entreprise: "Tech Solutions Dakar",
        date_debut: "2024-06-01",
        date_fin: "2024-08-31",
        description:
          "Participation au développement d'une application de gestion interne. Maintenance et ajout de nouvelles fonctionnalités.",
        user_id: admin.id,
      },
    ]);

    await Education.bulkCreate([
      {
        intitule: "Bachelor Concepteur Développeur d'Applications (CSI 3)",
        etablissement: "EPF Africa — Dakar",
        date_debut: "2023-09-01",
        date_fin: null,
        description:
          "Formation en développement d'applications, architecture logicielle, bases de données et gestion de projet.",
        user_id: admin.id,
      },
      {
        intitule: "Baccalauréat Scientifique",
        etablissement: "Lycée de Dakar",
        date_debut: "2020-09-01",
        date_fin: "2023-06-30",
        description: "Spécialité Mathématiques et Sciences de l'Ingénieur.",
        user_id: admin.id,
      },
    ]);

    await Certification.bulkCreate([
      {
        nom: "JavaScript Algorithms and Data Structures",
        organisme: "freeCodeCamp",
        date_obtention: "2025-03-15",
        lien_justificatif: "#",
        user_id: admin.id,
      },
      {
        nom: "Responsive Web Design",
        organisme: "freeCodeCamp",
        date_obtention: "2024-11-20",
        lien_justificatif: "#",
        user_id: admin.id,
      },
    ]);

    console.log("Données de démonstration insérées.");
    console.log(`Admin: ${admin.email} / ${process.env.ADMIN_PASSWORD || "Admin123!"}`);
    process.exit(0);
  } catch (error) {
    console.error("Erreur seed:", error);
    process.exit(1);
  }
};

seed();
